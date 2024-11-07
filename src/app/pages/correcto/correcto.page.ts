import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {
  usuario: Usuario | null = null; // Inicializa como null
  preguntaSecreta: string = ''; // Inicializa como cadena vacía

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['usuario'];
      if (this.usuario) {
        this.preguntaSecreta = this.usuario.preguntaSecreta;
      } else {
        this.preguntaSecreta = 'Correo no encontrado';
      }
    }
  }

  navegarIngreso() {
    // Navega a la página de ingreso
    this.router.navigate(['/ingreso']);
  }
}
