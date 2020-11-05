import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

export class Match {

  constructor() {

  }

  public getTeamLogoHome(match, http, header) {

    http.get(match.link_home, {headers: header}).map(res => res.json()).subscribe(data => {
      //noinspection TypeScriptUnresolvedVariable
      if(data.crestUrl != null){
        //noinspection TypeScriptUnresolvedVariable
        match.img_home = data.crestUrl;
      }
    });

  }

  public getTeamLogoAway(match, http, header) {

    http.get(match.link_away, {headers: header}).map(res => res.json()).subscribe(data => {
      //noinspection TypeScriptUnresolvedVariable
      if(data.crestUrl != null){
        //noinspection TypeScriptUnresolvedVariable
        match.img_away = data.crestUrl;
      }
    });

  }

  public addMatchToStorage(href, team_home, team_away, date, status) {
    var matchs = [];
    if (localStorage.getItem("matchs") !== null) {
      matchs = JSON.parse(localStorage.getItem("matchs"));
    }

    matchs.push({href, team_home, team_away, date, status});

    window.localStorage.setItem('matchs', JSON.stringify(matchs));

  }

  public removeMatchFromStorage(href){
    var fixturesIds;
    if (localStorage.getItem("matchs") !== null) {
      fixturesIds = JSON.parse(window.localStorage.getItem('matchs'));

      for(var i = 0, len = fixturesIds.length; i < len; i++) {
        if (fixturesIds[i].href === href) {
          fixturesIds.splice(i, 1);
          break;
        }
      }

      window.localStorage.setItem('matchs', JSON.stringify(fixturesIds));
    }
  }

  public removeBetFromStorage(href){
    var fixturesIds;
    if (localStorage.getItem("bets") !== null) {
      fixturesIds = JSON.parse(window.localStorage.getItem('bets'));

      for(var i = 0, len = fixturesIds.length; i < len; i++) {
        if (fixturesIds[i].href === href) {
          fixturesIds.splice(i, 1);
          break;
        }
      }

      window.localStorage.setItem('bets', JSON.stringify(fixturesIds));
    }
  }
}
