import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { Competitions } from '../../pages/competitions/competitions';
import { Match } from '../../components/match/match';

import 'rxjs/add/operator/map';
import {DateTimeData} from "ionic-angular/umd/util/datetime-util";

@Component({
  selector: 'betpage',
  templateUrl: 'betpage.html'
})

export class BetPage {

  matchs: Array<{team_home: string, team_away: string, results: string, date: DateTimeData, href: string}>;
  matchsJSON: any;
  loader: any;
  bets: any;
  resultBet: any;
  match: any;
  headers: any;

  constructor(public navCtrl: NavController, public http: Http, private navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {

    this.init();
    this.initList();

  }

  init(){

    this.initLoader();

    this.headers = new Headers();
    this.headers.append('X-Auth-Token', '8f808e768121469e9b0330699175363b');

    this.matchs = [];
    this.match = new Match();
    this.resultBet = [];

    this.initBets();
    this.getFixtures();

  }

  getFixtures(){

    if (localStorage.getItem("matchs") !== null) {
      this.matchsJSON = JSON.parse(window.localStorage.getItem('matchs'));
    }

  }

  private initList(){

    if(typeof this.matchsJSON != 'undefined') {
      for (let f of this.matchsJSON) {
        if (f.status != 'FINISHED' && typeof f.status != 'undefined') {
          this.matchs.push({
            team_home: f.team_home,
            team_away: f.team_away,
            results: this.getBet(f.href),
            date: f.date,
            href: f.href
          });
        }

      }
    }

    if(this.matchs.length <= 0 || typeof this.matchs == 'undefined'){
      this.showAlertNoResult();
    }
  }

  public initBets(){

    this.bets = [
        ['1', 'X', '2', '1X', 'X2', '12'],
        ['OVER 0,5', 'OVER 1,5', 'OVER 2,5', 'OVER 3,5', 'UNDER 1,5', 'UNDER 2,5', 'UNDER 3,5'],
        ['GOAL', 'NOGOAL', 'PARI', 'DISPARI'],
        ['1-X', 'X-2', '1-2', '1 HT', 'X HF', '2 HF', '0-0', '1-0', '2-0', '3-0', '4-0', '0-1', '0-2', '0-3', '0-4', '1-1', '2-1', '3-1', '4-1', '1-2', '1-3', '1-4', '2-2', '3-2', '4-2', '2-3', '2-4', '3-3', '4-3', '3-4']
      ];
  }

  public generateRandomBet(){

    this.loader.present();

    for(var i = 0; i < this.matchs.length; i++){
      this.matchs[i].results = this.getRandomBet();
      this.saveBets(this.matchs[i].href, this.matchs[i].results);
    }

    window.localStorage.setItem('bets', JSON.stringify(this.resultBet));

    this.loader.dismiss();

  }

  private getRandomBet(){

    var random_1 = Math.floor(Math.random() * 10) + 1;
    var index;

    if(random_1 <= 3){
      index = 0;
    } else if(random_1 > 3 && random_1 <= 6){
      index = 1;
    } else if(random_1 > 6 && random_1 <= 8){
      index = 2;
    } else {
      index = 3;
    }

    if(index == 0 && (Math.floor(Math.random() * 2) == 1)){
      return this.bets[index][Math.floor(Math.random() * this.bets[index].length)] + ' + ' + this.bets[1][Math.floor(Math.random() * this.bets[2].length)];
    } else if(index == 1 && (Math.floor(Math.random() * 2) == 1)){
      return this.bets[0][Math.floor(Math.random() * this.bets[2].length)] + ' + ' + this.bets[index][Math.floor(Math.random() * this.bets[index].length)];
    }

    return this.bets[index][Math.floor(Math.random() * this.bets[index].length)];
  }

  private saveBets(href, bet){

    var index = this.resultBet.indexOf(href);

    if(index != -1){
      this.resultBet[index].bet = bet;
    } else {
      this.resultBet.push({href, bet});
    }

  }

  private getBet(href){

    var bets = [];

    if (localStorage.getItem("bets") !== null) {
      bets = JSON.parse(window.localStorage.getItem('bets'));
      for(var i = 0; i < bets.length; i++ ){
        if(bets[i].href == href){
          return bets[i].bet;
        }
      }
    }

  }

  private updateBet(href){

    var bets = [];
    var found = false;

    if (localStorage.getItem("bets") !== null) {
      bets = JSON.parse(window.localStorage.getItem('bets'));
      for(var i = 0; i < bets.length; i++ ){
        if(bets[i].href == href){
          bets[i].bet = this.getRandomBet();
          found = true;
        }
      }

      if(!found){
        //add new bet
        bets.push({href: href, bet: this.getRandomBet()});
      }

      window.localStorage.setItem('bets', JSON.stringify(bets));

    }

  }

  private showAlertNoResult() {

    let confirm = this.alertCtrl.create({
      title: 'Non ci sono partite',
      message: 'Aggiungi una o più partite per generare una scommessa.',
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

  private deleteList(){

    let confirm = this.alertCtrl.create({
      title: 'Rimuovere le scommesse?',
      message: 'Confermando verranno rimosse tutte le scommesse.',
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
            localStorage.removeItem('matchs');
            localStorage.removeItem('bets');
            this.navCtrl.push(Competitions);
          }
        }
      ]
    });

    confirm.present();

  }

  private presentOptions(href) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opzioni',
      buttons: [
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.deleteBet(href);
          }
        },{
          text: 'Rigenera',
          handler: () => {
            this.generateBet(href);
          }
        },{
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            //do nothing
          }
        }
      ]
    });
    actionSheet.present();
  }

  private generateBet(href) {

    let confirm = this.alertCtrl.create({
      title: 'Rigenerare?',
      message: 'Confermando verrà rigenerata la scommessa selezionata',
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

            this.updateBet(href);
            this.init();
            this.initList();
          }
        }
      ]
    });

    confirm.present();
  }

  private deleteBet(href) {

    let confirm = this.alertCtrl.create({
      title: 'Rimuovere?',
      message: 'Confermando verrà rimossa la scommessa selezionata',
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
            this.match.removeBetFromStorage(href);
            this.init();
            this.initList();
          }
        }
      ]
    });

    confirm.present();
  }

  private initLoader() {

    this.loader = this.loadingCtrl.create({
      content: "Sto generando..."
    });

  }
}
