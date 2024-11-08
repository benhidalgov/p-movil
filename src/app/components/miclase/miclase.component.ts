import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/Usuario';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports:[CommonModule]
})
export class MiclaseComponent{


  public usuario: Usuario = new Usuario();
  constructor(private authService: AuthService) {
    this.authService.usuarioAutenticado.subscribe((usuarioAutenticado)=>{
      if (usuarioAutenticado) {
        this.usuario = usuarioAutenticado;
      }
    })
  }

}
