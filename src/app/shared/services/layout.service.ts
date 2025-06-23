import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class LayoutService {
  public isTablet = true; // Força modo tablet

  // Para uso futuro:
  // public isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
  // Ou, se usar Ionic Platform:
  // constructor(platform: Platform) {
  //   this.isTablet = platform.width() >= 768 && platform.width() <= 1024;
  // }
}