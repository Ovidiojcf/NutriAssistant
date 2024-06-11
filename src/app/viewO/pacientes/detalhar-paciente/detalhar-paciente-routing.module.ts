import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalharPacientePage } from './detalhar-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: DetalharPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalharPacientePageRoutingModule {}
