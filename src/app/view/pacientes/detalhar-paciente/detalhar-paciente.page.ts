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
      this.authService.getUserFullData().subscribe(user => {
        this.user = user;
      });
    }

  ngOnInit() {
    this.paciente = history.state.paciente;

  }

  voltar() {
    this.navCtrl.back(); // voltar para a pagina anterior
  }
  cadastrarFicha() {
    if (this.paciente) {
      this.router.navigate(['/cadastrar-ficha'], { state: { paciente: this.paciente } });
    } else {
      alert('Paciente não carregado. Tente novamente.');
    }
  }
}
