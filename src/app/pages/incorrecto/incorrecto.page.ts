import { Usuario } from './../../model/Usuario';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NivelEducacional } from 'src/app/model/nivel-educacional';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit {

  public usuario: Usuario = new Usuario(
    'cuenta123',                  
    'correo@ejemplo.com',         
    'passwordSegura',             
    '¿Cuál es tu color favorito?',
    'Azul',                       
    'Juan',                       
    'Díaz',                       
    new NivelEducacional(),       
    new Date('2001-02-14')        
);


  constructor(private router: Router,){}

  navegarIngreso() {
    this.router.navigate(['/ingreso']);
  }

  ngOnInit() {
  }

}
