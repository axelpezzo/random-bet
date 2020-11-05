import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { BetPage } from '../../pages/betpage/betpage';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'generate-buttons',
  templateUrl: 'generate-buttons.html'
})
export class GenerateButtons {

  constructor(private navCtrl: NavController, public alertCtrl: AlertController, public betpage: BetPage) {

  }

  private goToList() {
    let confirm = this.alertCtrl.create({
      title: 'Rigenerare?',
      message: 'Confermando verranno rigenerati i risultati.',
      buttons: [
        {
          text: 'Annulla',
          handler: () => {
            //do nothing
          }
        },
        {
          text: 'Rigenera',
          handler: () => {
            this.betpage.generateRandomBet();
          }
        }
      ]
    });

    confirm.present();
  }
}
