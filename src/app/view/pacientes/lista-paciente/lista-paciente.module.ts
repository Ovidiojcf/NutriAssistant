import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPacientePageRoutingModule } from './lista-paciente-routing.module';

import { ListaPacientePage } from './lista-paciente.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPacientePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListaPacientePage]
})
export class ListaPacientePageModule {}
