import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisdatosPageRoutingModule } from './misdatos-routing.module';
import { InicioPage } from './misdatos.page'; // Asegúrate de usar la ruta correcta

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MisdatosPageRoutingModule],
  declarations: [InicioPage], // Agrega tu componente aquí
})
export class MisdatosPageModule {}
  