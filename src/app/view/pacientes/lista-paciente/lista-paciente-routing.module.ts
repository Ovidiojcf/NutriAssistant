import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPacientePage } from './lista-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPacientePageRoutingModule {}
