import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import Paciente from 'src/app/model/entities/Paciente';
import { AuthService } from 'src/app/model/services/auth.service';


@Component({
  selector: 'app-detalhar-paciente',
  templateUrl: './detalhar-paciente.page.html',
  styleUrls: ['./detalhar-paciente.page.scss'],
})
export class DetalharPacientePage implements OnInit {
  paciente!: Paciente;
  public user: any;
  public formDetalhes!: FormGroup;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController
    ) { 
      this.user = this.authService.getUserLogged();
    }

  ngOnInit() {
    this.paciente = history.state.paciente;

  }

  voltar() {
    this.navCtrl.back(); // voltar para a pagina anterior
  }
  cadastrarFicha() {
    const navigationExtras: NavigationExtras = {
      state: {
        paciente: this.paciente
      }
    };
    this.router.navigate(['cadastrar-ficha'], navigationExtras);
  }
}
