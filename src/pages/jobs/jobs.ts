import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from './../../services/data.service';
import { JobdetPage } from '../jobdet/jobdet';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
  providers:[ DataService]
})
export class JobsPage {
  private joblist:Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private datasvc:DataService) {
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
