import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs/tabs.component';
import { CadastrarPacientePageModule } from '../view/pacientes/cadastrar-paciente/cadastrar-paciente.module';




@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CadastrarPacientePageModule
  ],
  declarations: [
    TabsComponent
  ],
  exports: [
    TabsComponent
  ]
})
export class ComponentsModule { }