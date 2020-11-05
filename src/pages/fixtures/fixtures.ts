import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { Match } from '../../components/match/match';
import { Competitions } from '../../pages/competitions/competitions';

import 'rxjs/add/operator/map';
import {DateTimeData} from "ionic-angular/umd/util/datetime-util";

@Component({
  selector: 'page-fixtures',
  templateUrl: 'fixtures.html',
})

export class Fixtures {

  fixtures: Array<{matchday: string, match: Array<{link_home: string, team_home: string, link_away: string, team_away: string, date: DateTimeData, status: string, href: string, visible: boolean;}>}>;
  loader: any;
  headers: any;
  match: any;
  comp: any;

  constructor(public navCtrl: NavController, public http: Http, private navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    this.init();
    this.initList();

  }

  //initialize base variables;
  private init(){

    this.initLoader();

    this.headers = new Headers();
    this.headers.append('X-Auth-Token', '8f808e768121469e9b0330699175363b');

    this.fixtures = [];
    this.match = new Match();

    let compId = this.navParams.get('compId');
    this.comp = {name: this.navParams.get('compName'), id: this.navParams.get('compId')};

  }

  //fetch all data from APIs an built the main list
  private initList(){

    this.loader.present();

    this.http.get('http://api.football-data.org/v1/competitions/' + this.comp.id + '/fixtures?timeFrame=n7', {headers: this.headers}).map(res => res.json()).subscribe(data => {

      if(data.count <= 0){

        this.showAlertNoResult();

      } else {

        for (var i = 0, y = 0, z = -1; i < data.count; i++) {

          var index = this.fixtures.map((el) => el.matchday).indexOf(data.fixtures[i].matchday);

          if (data.fixtures[i].status != 'FINISHED') {
            if (index === -1) {
              this.fixtures.push({
                matchday: data.fixtures[i].matchday,
                match: []
              });
              z++;
              y = 0;
            }

            this.fixtures[z].match.push({
              link_home: data.fixtures[i]._links.homeTeam.href,
              team_home: data.fixtures[i].homeTeamName,
              link_away: data.fixtures[i]._links.awayTeam.href,
              team_away: data.fixtures[i].awayTeamName,
              date: data.fixtures[i].date,
              status: data.fixtures[i].status,
              href: data.fixtures[i]._links.self.href,
              visible: this.checkFixturesInStorage(data.fixtures[i]._links.self.href)
            });

            //this.match.getTeamLogoHome(this.fixtures[z].match[y], this.http, this.headers);
            //this.match.getTeamLogoAway(this.fixtures[z].match[y], this.http, this.headers);

            y++;
          }

        }
      }

    });

    this.loader.dismiss();

  }

  private checkFixturesInStorage(href){

    var fixturesIds;

    if (localStorage.getItem("matchs") !== null) {
      fixturesIds = JSON.parse(window.localStorage.getItem('matchs'));
      for (let f of fixturesIds) {
        if(f.href == href){
          return false;
        }
      }
      return true;
    } else {
      return true;
    }

  }

  private addMatch(href, team_home, team_away, date, status) {

    let confirm = this.alertCtrl.create({
      title: 'Aggiungere?',
      message: 'Confermando verrà aggiunta la partita selezionata.',
      buttons: [
        {
          text: 'Annulla',
          handler: () => {
            //do nothing
          }
        },
        {
          text: 'Aggiungi',
          handler: () => {

            this.match.addMatchToStorage(href, team_home, team_away, date, status);

            for(var i = 0; i < this.fixtures.length; i++){
              var index = this.fixtures[i].match.map((el) => el.href).indexOf(href);
              if(index !== -1){
                this.fixtures[i].match[index].visible = !this.fixtures[i].match[index].visible;
              }
            }

          }
        }
      ]
    });

    confirm.present();

  }

  private removeMatch(href) {

    let confirm = this.alertCtrl.create({
      title: 'Rimuovere?',
      message: 'Confermando verrà rimossa la partita selezionata.',
      buttons: [
        {
          text: 'Annulla',
          handler: () => {
            //do nothing
          }
        },
        {
          text: 'Rimuovi',
          handler: () => {

            this.match.removeMatchFromStorage(href);

            for(var i = 0; i < this.fixtures.length; i++){
              var index = this.fixtures[i].match.map((el) => el.href).indexOf(href);
              if(index !== -1){
                this.fixtures[i].match[index].visible = !this.fixtures[i].match[index].visible;
              }
            }
          }
        }
      ]
    });

    confirm.present();

  }

  private showAlertNoResult() {

    let confirm = this.alertCtrl.create({
      title: 'Non ci sono partite',
      message: 'Non ci sono partite questa settimana.',
      buttons: [
        {
          text: 'Torna all\'home page',
          handler: () => {
            this.navCtrl.push(Competitions);
          }
        }
      ]
    });

    confirm.present();

  }

  private initLoader() {

    this.loader = this.loadingCtrl.create({
      content: "Sto caricando..."
    });

  }

}