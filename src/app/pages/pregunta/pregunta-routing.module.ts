import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreguntaPage } from './pregunta.page';

const routes: Routes = [
  {
    path: '',
    component: PreguntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreguntaPageRoutingModule { }
