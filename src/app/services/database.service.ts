import { capSQLiteChanges, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { EducationalLevel } from '../model/educational-level';
import { showAlert, showAlertError, showToast } from '../tools/message-functions';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';
import { Observable, of } from 'rxjs'; // Asegúrate de importar 'of' para crear un Observable
import { NivelEducacional } from '../model/nivel-educacional';
import { Usuario } from '../model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Test users
  testUser1 = User.getNewUsuario(
    'atorres',
    'atorres@duocuc.cl',
    '1234',
    '¿Cuál es tu animal favorito?',
    'gato',
    'Ana',
    'Torres',
    EducationalLevel.findLevel(6)!,
    new Date(2000, 0, 5),
    'La Florida',
    'default-image.jpg'
  );

  testUser2 = User.getNewUsuario(
    'jperez',
    'jperez@duocuc.cl',
    '5678',
    '¿Cuál es tu postre favorito?',
    'panqueques',
    'Juan',
    'Pérez',
    EducationalLevel.findLevel(5)!,
    new Date(2000, 1, 10),
    'La Pintana',
    'default-image.jpg'
  );

  testUser3 = User.getNewUsuario(
    'cmujica',
    'cmujica@duocuc.cl',
    '0987',
    '¿Cuál es tu vehículo favorito?',
    'moto',
    'Carla',
    'Mujica',
    EducationalLevel.findLevel(6)!,
    new Date(2000, 2, 20),
    'Providencia',
    'default-image.jpg'
  );

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`CREATE TABLE IF NOT EXISTS USER (
        userName TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        secretQuestion TEXT NOT NULL,
        secretAnswer TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        educationalLevel INTEGER NOT NULL,
        dateOfBirth TEXT NOT NULL,
        address TEXT NOT NULL,
        image TEXT NOT NULL
      );`]
    }
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USER (
      userName,
      email,
      password,
      secretQuestion,
      secretAnswer,
      firstName,
      lastName,
      educationalLevel,
      dateOfBirth,
      address,
      image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  dataBaseName = 'DinosaurDataBase';
  db!: SQLiteDBConnection;
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  // Lista de niveles educacionales
  private nivelesEducacionales: NivelEducacional[] = [
      NivelEducacional.getNivelEducacional(1, 'Básica Incompleta'),
      NivelEducacional.getNivelEducacional(2, 'Básica Completa'),
      NivelEducacional.getNivelEducacional(3, 'Media Incompleta'),
      NivelEducacional.getNivelEducacional(4, 'Media Completa'),
      NivelEducacional.getNivelEducacional(5, 'Superior Incompleta'),
      NivelEducacional.getNivelEducacional(6, 'Superior Completa')
  ];
  authService: any;
  usuario: any;
  bd: any;


  constructor(private sqliteService: SQLiteService) { }

  async initializeDataBase() {
    try {
      await this.sqliteService.createDataBase({ database: this.dataBaseName, upgrade: this.userUpgrades });
      this.db = await this.sqliteService.open(this.dataBaseName, false, 'no-encryption', 1, false);
      await this.createTestUsers();
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.initializeDataBase', error);
    }
  }

  async createTestUsers() {
    try {
      const user1 = await this.readUser(this.testUser1.userName);
      if (!user1) {
        await this.saveUser(this.testUser1);
      }

      const user2 = await this.readUser(this.testUser2.userName);
      if (!user2) {
        await this.saveUser(this.testUser2);
      }

      const user3 = await this.readUser(this.testUser3.userName);
      if (!user3) {
        await this.saveUser(this.testUser3);
      }
    } catch (error) {
      showAlertError('DataBaseService.createTestUsers', error);
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await this.db.run(this.sqlInsertUpdate, [
        user.userName,
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(user.dateOfBirth),
        user.address,
        user.image
      ]);
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.saveUser', error);
    }
  }

  async readUsers(): Promise<User[]> {
    try {
      const q = 'SELECT * FROM USER;';
      const rows = (await this.db.query(q)).values;
      let users: User[] = [];
      if (rows) {
        users = rows.map((row: any) => this.rowToUser(row));
      }
      this.userList.next(users);
      return users;
    } catch (error) {
      showAlertError('DataBaseService.readUsers', error);
      return [];
    }
  }

  async readUser(userName: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE userName=?;';
      const rows = (await this.db.query(q, [userName])).values;
      return rows?.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.readUser', error);
      return undefined;
    }
  }

  async findUser(userName: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.readUser(userName);
      // Validar que el usuario existe y la contraseña es correcta
      if (user && user.password === password) {
        return user;
      }
      return undefined; // Retornar undefined si el usuario no existe o la contraseña es incorrecta
    } catch (error) {
      showAlertError('DataBaseService.findUser', error);
      return undefined;
    }
  }

  rowToUser(row: any): User {
    return User.getNewUsuario(
      row.userName,
      row.email,
      row.password,
      row.secretQuestion,
      row.secretAnswer,
      row.firstName,
      row.lastName,
      EducationalLevel.findLevel(row.educationalLevel)!,
      convertStringToDate(row.dateOfBirth),
      row.address,
      row.image
    );
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const q = 'SELECT * FROM USER WHERE email=?;';
      const rows = (await this.db.query(q, [email])).values;
      return rows?.length ? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByEmail', error);
      return undefined;
    }
  }

  async guardarUsuario() {
    try {
      // Verifica los datos del usuario antes de guardar
      if (!this.usuario.nombre || !this.usuario.apellido || !this.usuario.correo) {
        showAlert('Error Por favor, completa todos los campos obligatorios.');
        return;
      }
      // Guarda el usuario en la base de datos
      await this.bd.saveUser(this.usuario);

      // Actualiza el usuario autenticado
      this.authService.guardarUsuarioAutenticado(this.usuario);

      showToast('Sus datos fueron actualizados');
    } catch (error) {
      showAlert('Error Por favor, completa todos los campos obligatorios.');
    }
  }
  // Método para obtener la lista de niveles educacionales
  getNivelEducacionalList(): Observable<NivelEducacional[]> {
    return of(this.nivelesEducacionales); // Devuelve la lista como un Observable
  }
}
