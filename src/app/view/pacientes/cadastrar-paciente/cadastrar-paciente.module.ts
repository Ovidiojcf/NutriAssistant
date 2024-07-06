import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastrarPacientePageRoutingModule } from './cadastrar-paciente-routing.module';

import { CadastrarPacientePage } from './cadastrar-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastrarPacientePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadastrarPacientePage]
})
export class CadastrarPacientePageModule {}
