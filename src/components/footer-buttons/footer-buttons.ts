import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { BetPage } from '../../pages/betpage/betpage';

@Component({
  selector: 'footer-buttons',
  templateUrl: 'footer-buttons.html'
})
export class FooterButtons {

  constructor(private navCtrl: NavController) {

  }

  private goToList() {
    this.navCtrl.push(BetPage);
  }
}
