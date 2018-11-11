import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Time } from '@angular/common';

/**
 * Generated class for the JobdetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jobdet',
  templateUrl: 'jobdet.html',
})
export class JobdetPage {
  private varJob: object;
  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.varJob=navParams.get('parSelectedJob');
    this.event = {
      month: '1990-02-19',
      timeStarts: '07:43',
      timeEnds: '1990-02-20'
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobdetPage');
  }
  
}
