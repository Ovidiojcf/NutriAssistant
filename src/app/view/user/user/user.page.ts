import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/model/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router : Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  logout(){
    this.authService.signOut().then((res)=>{
      this.router.navigate(['login']);
    })
  }

  voltar() {
    this.navCtrl.back(); // voltar para a pagina anterior
  }

}
