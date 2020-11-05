import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Competitions } from '../pages/competitions/competitions';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = Competitions;

  constructor(platform: Platform) {
    //noinspection TypeScriptUnresolvedFunction
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

  }
}
