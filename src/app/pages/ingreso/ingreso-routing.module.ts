import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoPage } from './ingreso.page';
import { CorreoPage } from '../correo/correo.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoPage,
  },
  {
    path: 'Correo',
    component: CorreoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoPageRoutingModule {}
