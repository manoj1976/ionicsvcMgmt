import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from './../../services/data.service';
import { AppService } from '../../services/app.service';
import { SQLiteHelperService } from '../../services/sqlitehelper.service';
import { JobdetPage } from '../jobdet/jobdet';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
  providers:[ DataService,AppService,SQLiteHelperService]
})
export class JobsPage {
  private joblist:Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private datasvc:DataService,private appsvc:AppService,private sqlitehelperSvc:SQLiteHelperService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrderproductcatePage');
    setTimeout(()=> {
     this.joblist=this.datasvc.getJobs();
   }, 500);
   }
   
   itm_click(parjob){
     
    this.navCtrl.push(JobdetPage,{parSelectedJob:parjob})
   }
}
