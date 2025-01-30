import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastrarFichaPage } from './cadastrar-ficha.page';

const routes: Routes = [
  {
    path: '',
    component: CadastrarFichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastrarFichaPageRoutingModule {}
