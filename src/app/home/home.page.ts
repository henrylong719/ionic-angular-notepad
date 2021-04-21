import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    // AlertController will allow use to create alert component
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}
}
