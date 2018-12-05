import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ErrorHandler } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { RegisterPage } from '../register/register';

@Component({
    template: 
'<ion-list><button ion-item (click)="RegisterApp()">Register App</button> <!--<button ion-item (click)="close()">Close</button>--></ion-list>',
 })
 export class LoginPopoverPage {
    constructor(public viewCtrl: ViewController,public navCtrl: NavController) {}
    
      close() {
        this.viewCtrl.dismiss();
      }

      RegisterApp(){
        this.close();
        this.navCtrl.push(RegisterPage);
      }
 }