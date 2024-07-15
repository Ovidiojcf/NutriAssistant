import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./view/user/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'cadastrar',
    loadChildren: () => import('./view/user/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./view/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cadastrar-paciente',
    loadChildren: () => import('./view/pacientes/cadastrar-paciente/cadastrar-paciente.module').then(m => m.CadastrarPacientePageModule)
  },
  {
    path: 'lista-paciente',
    loadChildren: () => import('./view/pacientes/lista-paciente/lista-paciente.module').then( m => m.ListaPacientePageModule)
  },
  {
    path: 'detalhar-paciente',
    loadChildren: () => import('./view/pacientes/detalhar-paciente/detalhar-paciente.module').then(m => m.DetalharPacientePageModule)
  },  {
    path: 'user',
    loadChildren: () => import('./view/user/user/user.module').then( m => m.UserPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
