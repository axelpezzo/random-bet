import { Component } from '@angular/core';

import {NavController, List} from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';

import { Fixtures } from '../fixtures/fixtures';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-competitions',
  templateUrl: 'competitions.html'
})

export class Competitions {

  comps: Array<{logo: string, name: string, id: number}>;
  nations: Array<{acronym: string, info: {nation: string, logo: string}}>
  headers: any;

  constructor(public navCtrl: NavController, public http: Http) {

    this.init();
    this.initList();

  }

  //initialize base variables;
  private init(){

    this.headers = new Headers();
    this.headers.append('X-Auth-Token', '8f808e768121469e9b0330699175363b');

    this.comps = [];
    this.nations = [];

    this.initNations();

  }

  //initialize nations
  private initNations(){

    this.nations.push({
      acronym: 'PL',
      info: {
        nation: 'GB',
        logo: 'gb.png'
      }
    });

    this.nations.push({
      acronym: 'ELC',
      info: {
        nation: 'GB',
        logo: 'gb.png'
      }
    });

    this.nations.push({
      acronym: 'EL1',
      info: {
        nation: 'GB',
        logo: 'gb.png'
      }
    });

    this.nations.push({
      acronym: 'BL2',
      info: {
        nation: 'DE',
        logo: 'de.png'
      }
    });

    this.nations.push({
      acronym: 'BL1',
      info: {
        nation: 'DE',
        logo: 'de.png'
      }
    });

    this.nations.push({
      acronym: 'DFB',
      info: {
        nation: 'PL',
        logo: 'pl.png'
      }
    });

    this.nations.push({
      acronym: 'DED',
      info: {
        nation: 'NL',
        logo: 'nl.png'
      }
    });

    this.nations.push({
      acronym: 'FL1',
      info: {
        nation: 'FR',
        logo: 'fr.png'
      }
    });

    this.nations.push({
      acronym: 'FL2',
      info: {
        nation: 'FR',
        logo: 'fr.png'
      }
    });

    this.nations.push({
      acronym: 'PD',
      info: {
        nation: 'ES',
        logo: 'es.png'
      }
    });

    this.nations.push({
      acronym: 'SD',
      info: {
        nation: 'ES',
        logo: 'es.png'
      }
    });

    this.nations.push({
      acronym: 'SA',
      info: {
        nation: 'IT',
        logo: 'it.png'
      }
    });

    this.nations.push({
      acronym: 'PPL',
      info: {
        nation: 'PT',
        logo: 'pt.png'
      }
    });

    this.nations.push({
      acronym: 'CL',
      info: {
        nation: 'EU',
        logo: 'eu.png'
      }
    });

  }

  //fetch all data from APIs an built the main list
  private initList(){

    this.http.get('http://api.football-data.org/v1/competitions', {headers: this.headers}).map(res => res.json()).subscribe(data => {
      for(var i = 0; i < data.length; i++) {
        if(data[i].league !== 'EC') {
          this.comps.push({
            logo: this.getNationLogo(data[i].league),
            name: data[i].caption,
            id: data[i].id
          });
        }
      }
    });

  }

  private getNationLogo(league: string){
    for(var i = 0; i < this.nations.length; i++) {
      if (league === this.nations[i].acronym) {
        return 'assets/nations/' + this.nations[i].info.logo;
      }
    }
  }

  pushPage(id: number, name: string){
    this.navCtrl.push(Fixtures, {
      compId: id,
      compName: name
    });
  }

}