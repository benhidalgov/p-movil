import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { showAlert, showToast } from 'src/app/tools/message-functions';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MisdatosComponent implements OnInit, OnDestroy {
  public usuario: Usuario = new Usuario();
  public repeticionPassword: string = '';
  private dbSubscription: Subscription | undefined;
  user: User = new User;

  constructor(private authService: AuthService, private dbService: DatabaseService) { }

  ngOnInit() {
    this.authService.usuarioAutenticado.subscribe((usuario: Usuario | null) => {
      if (usuario) {
        this.usuario = usuario;
        this.repeticionPassword = usuario.password;
      } else {
        this.usuario = new Usuario();
        this.repeticionPassword = '';
      }
    });
  }


  ngOnDestroy() {
    if (this.dbSubscription) {
      this.dbSubscription.unsubscribe();
    }
  }

  mostrarMensaje(nombreCampo: string, valor: string): boolean {
    if (valor.trim() === '') {
      showAlert(`Debe ingresar un valor para el campo "${nombreCampo}".`);
      return false;
    }
    return true;
  }

  async guardarCambios() {
    try {
      if (!this.mostrarMensaje('nombre', this.usuario.nombre)) return;
      if (!this.mostrarMensaje('apellidos', this.usuario.apellido)) return;
      if (!this.mostrarMensaje('correo', this.usuario.correo)) return;
      if (!this.mostrarMensaje('Pregunta secreta', this.usuario.preguntaSecreta)) return;
      if (!this.mostrarMensaje('Respuesta secreta', this.usuario.respuestaSecreta)) return;
      if (!this.mostrarMensaje('Contrasena', this.usuario.password)) return;
      if (this.usuario.password !== this.repeticionPassword) {
        showAlert('Las contraseñas escritas deben ser iguales.');
        return;
      }

      await this.dbService.saveUser(this.user);
      this.authService.guardarUsuarioAutenticado(this.usuario);
      showToast('Sus datos fueron actualizados');
    } catch (error) {
      showAlert('Error Hubo un problema al guardar los datos. Inténtalo de nuevo.');
    }
  }
}
