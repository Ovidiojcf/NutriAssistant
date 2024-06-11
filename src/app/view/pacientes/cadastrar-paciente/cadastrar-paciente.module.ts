import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastrarPacientePageRoutingModule } from './cadastrar-paciente-routing.module';

import { CadastrarPacientePage } from './cadastrar-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastrarPacientePageRoutingModule
  ],
  declarations: [CadastrarPacientePage]
})
export class CadastrarPacientePageModule {}
