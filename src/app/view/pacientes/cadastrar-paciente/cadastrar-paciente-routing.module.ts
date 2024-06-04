import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastrarPacientePage } from './cadastrar-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: CadastrarPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastrarPacientePageRoutingModule {}
