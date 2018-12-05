import { LoginPopoverPage } from './login.popover';
import { IUser } from './../../interfaces/user.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import {DataService} from '../../services/data.service';
import { SQLiteHelperService} from '../../services/sqlitehelper.service';
import { ISubscription } from 'rxjs/Subscription';
import { AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { AppService } from '../../services/app.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[AppService,DataService,SQLiteHelperService]
})
export class LoginPage {
  private loginAttemptCnt:number=0;

  private varUser={userid:'',pwd:'',varDisable:true,guestlogin:false,varInfo:''};
  private subsAuthCust:ISubscription;
  constructor(public navCtrl: NavController, public navParams: NavParams,private appsvc:AppService,private datasvc:DataService,private sqlHlperSvc:SQLiteHelperService,private alertCtrl: AlertController,public popoverCtrl: PopoverController) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
    setTimeout(()=> {
      this.varUser.varDisable= this.appsvc.enableAllCntrl();
    }, 1000);
  }

  ionViewWillLeave(){
    if (!this.appsvc.isNull(this.subsAuthCust))
     this.subsAuthCust.unsubscribe();
  }

  btn_LoginClick(){
    let _varUser:IUser={UserID:this.varUser.userid,GuestUser:false}
    this.varUser.varInfo='';
    if ((this.appsvc.isNull(AppService.getSettings())) || (AppService.getSettings().WebapiBaseURL=='')) {
      _varUser.UserID=this.appsvc.getGuestUser();
      _varUser.GuestUser=true;
      AppService.setUser(_varUser);
      alert('Please register the app.')
      this.navCtrl.setRoot(HomePage);return;
    }

    if (this.varUser.guestlogin){
      _varUser.UserID=this.appsvc.getGuestUser();
      _varUser.GuestUser=true;
      AppService.setUser(_varUser);
      this.navCtrl.setRoot(HomePage);return;
    }

    if (this.appsvc.isNull(this.varUser)){
     this.varUser.varInfo='Please specify the usr id and pwd.';
     return;
    }
    if (this.appsvc.isNull(this.varUser.userid) || this.appsvc.isNull(this.varUser.pwd)){
      this.varUser.varInfo='Please specify the usr id and pwd.';
       return;
    }

    this.loginAttemptCnt++;
    this.varUser.varDisable= this.appsvc.disableAllCtrl();
    if (this.loginAttemptCnt>4){
      this.presentGUESTLoginConfirm();
      return;
    }
    if (!this.appsvc.checkNetwork()){ //if no network connection
      this.authUser();
    }
    else{
      this.subsAuthCust= this.datasvc.authUser(this.varUser.userid,this.varUser.pwd)
       .subscribe(
         (data:any)=>{
           if (data.resultmsg=='valid'){
           _varUser.UserID=data.userid;_varUser.GuestUser=false;
           AppService.setUser(_varUser);
           this.navCtrl.setRoot(HomePage);
           }else {
            this.varUser.varDisable= this.appsvc.enableAllCntrl();
            //console.log(data.resultmsg);
             this.varUser.varInfo=data.resultmsg;}
             this.varUser.userid='';this.varUser.pwd='';
          },
         Error=>{this.appsvc.errorHandler(Error);this.authUser();}
       );
      }
  }

  authUser(){
    let _varUser:IUser={UserID:this.varUser.userid,GuestUser:false}
    
    let _readUserSQL:string='Select code,name from login ';
    _readUserSQL =_readUserSQL+" where upper(code)='"+ this.varUser.userid.toUpperCase()+ "' and password='"+this.varUser.pwd+"'";
    this.sqlHlperSvc.executeSQL(_readUserSQL)
    .then((response:any)=>
    {
        if (response.rows.length==0) {
            this.varUser.varInfo='Invalid user id/password';
            this.varUser.varDisable= this.appsvc.enableAllCntrl();
            return;
        }
        _varUser.UserID=this.varUser.userid;_varUser.GuestUser=false;
        AppService.setUser(_varUser);
        this.navCtrl.setRoot(HomePage);
    })
    .catch((error:Error)=>{alert('120:Error while reading the login table.');
    this.appsvc.errorHandler(error);
    this.varUser.varDisable= this.appsvc.enableAllCntrl();
    })
  }

  presentGUESTLoginConfirm() {
    let _varUser:IUser={UserID:this.varUser.userid,GuestUser:false}
    let alert = this.alertCtrl.create({
      title: 'Login as Guest user',
      message: 'Login as Guest user?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
            this.loginAttemptCnt=0;
            this.varUser.varDisable= this.appsvc.enableAllCntrl();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //console.log('Buy clicked');
            _varUser.UserID=this.appsvc.getGuestUser();
            _varUser.GuestUser=true;
            AppService.setUser(_varUser);
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

presentPopover(myEvent) {
  let popover = this.popoverCtrl.create(LoginPopoverPage,);
  popover.present({
    ev: myEvent
  });
}

}
