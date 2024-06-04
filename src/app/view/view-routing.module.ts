import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPage } from './view.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPage
  },
  {
    path: 'signin',
    loadChildren: () => import('./user/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./user/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'cadastrar-paciente',
    loadChildren: () => import('./pacientes/cadastrar-paciente/cadastrar-paciente.module').then( m => m.CadastrarPacientePageModule)
  },
  {
    path: 'detalhar-paciente',
    loadChildren: () => import('./pacientes/detalhar-paciente/detalhar-paciente.module').then( m => m.DetalharPacientePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPageRoutingModule {}
