import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./view/user/signin/signin.module').then( m => m.SigninPageModule)
  },
  // Rotas protegidas:
  {
    path: 'home',
    loadChildren: () => import('./view/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cadastrar-paciente',
    loadChildren: () => import('./view/pacientes/cadastrar-paciente/cadastrar-paciente.module').then(m => m.CadastrarPacientePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-paciente',
    loadChildren: () => import('./view/pacientes/lista-paciente/lista-paciente.module').then( m => m.ListaPacientePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalhar-paciente',
    loadChildren: () => import('./view/pacientes/detalhar-paciente/detalhar-paciente.module').then(m => m.DetalharPacientePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./view/user/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cadastrar-ficha',
    loadChildren: () => import('./view/pacientes/cadastrar-ficha/cadastrar-ficha.module').then( m => m.CadastrarFichaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cadastar-user',
    loadChildren: () => import('./view/user/signup/signup.module').then( m => m.SignupPageModule),
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
