import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Time } from '@angular/common';
import { DataService } from './../../services/data.service';
import { AppService } from '../../services/app.service';
import { SQLiteHelperService } from '../../services/sqlitehelper.service';

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
  providers:[ DataService,AppService,SQLiteHelperService]
})
export class JobdetPage {
private jobdetlist:Array<any>;


  private varJob: object={};
  private pepperoni:boolean;
  public event = {
    month: '1990-02-19',
    timeStarts: '00:00',
    timeEnds: '1990-02-20',
    totaltime:'01:00'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private datasvc:DataService,private appsvc:AppService,private sqlitehelperSvc:SQLiteHelperService) {
    this.varJob=navParams.get('parSelectedJob');
    this.event = {
      month: '1990-02-19',
      timeStarts: '00:30',
      timeEnds: '1990-02-20',
      totaltime:'00:30'
    }
    this.pepperoni=true;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad JobdetPage');
    setTimeout(()=> {
      this.jobdetlist=this.datasvc.getJobDetails('J003');
    }, 500);
  }
  
}
