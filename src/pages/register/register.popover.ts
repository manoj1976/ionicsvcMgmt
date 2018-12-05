import { Component, ErrorHandler } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SQLiteHelperService} from '../../services/sqlitehelper.service';
import { AppService } from './../../services/app.service';

@Component({
    template: 
'<ion-list><!--<ion-list-header>Database</ion-list-header>--><button ion-item (click)="DropSettingsTbl()">Drop Sett. Tble</button> <button ion-item (click)="close()">Close</button></ion-list>',
  providers:[ AppService,SQLiteHelperService]
 })
 export class RegisterPopoverPage {
    constructor(public viewCtrl: ViewController,private sqlHlperSvc:SQLiteHelperService,private appsvc:AppService) {}
    
      close() {
        this.viewCtrl.dismiss();
      }
      DropSettingsTbl(){
        this.sqlHlperSvc.executeSQL(this.sqlHlperSvc._dropSettingsTbl)
        .then(e=>{alert('Setting table is deleted');this.close();})
        .catch((error:any)=>{alert('112:Error while dropping the Setting table.');this.appsvc.errorHandler(error);this.close();}
      );
      }
 }