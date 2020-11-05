import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Fixtures } from '../pages/fixtures/fixtures';
import { Competitions } from '../pages/competitions/competitions';
import { BetPage } from '../pages/betpage/betpage';
import { FooterButtons } from '../components/footer-buttons/footer-buttons';
import { GenerateButtons } from '../components/generate-buttons/generate-buttons';
import { OrderByPipe } from './pipe/pipeorder';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    Competitions,
    Fixtures,
    FooterButtons,
    GenerateButtons,
    OrderByPipe,
    BetPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Competitions,
    Fixtures,
    FooterButtons,
    GenerateButtons,
    BetPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})

export class AppModule {}
