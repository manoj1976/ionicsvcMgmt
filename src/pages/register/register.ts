import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import { SQLiteHelperService } from '../../services/sqlitehelper.service';
import { ISettings } from '../../interfaces/settings.interface';
import { PopoverController } from 'ionic-angular';
import { RegisterPopoverPage } from './register.popover';
import { ISubscription } from 'rxjs/Subscription';
import { Device } from '@ionic-native/device';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[AppService,DataService,SQLiteHelperService]
})
export class RegisterPage {
  varRegister={username:'',youremail:'',regemail:'',varDisable:false,deviceid:'',varInfo:''};
  private subsRegisterApp:ISubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,private appsvc:AppService,private datasvc:DataService,private sqlHlperSvc:SQLiteHelperService,public popoverCtrl: PopoverController,private device: Device) {
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad RegisterPage');
  }

  ionViewWillLeave(){
    if (!this.appsvc.isNull(this.subsRegisterApp))
     this.subsRegisterApp.unsubscribe();
  }

  btn_RegisterClick(){
    this.varRegister.varInfo='';
    if (this.appsvc.isNull(this.varRegister.username)){
      alert('Please specify your name');return;}
    if (this.appsvc.isNull(this.varRegister.youremail)){
      alert('Please specify your email');return;}
    if (this.appsvc.isNull(this.varRegister.regemail)){
    alert('Please specify the registered email');return;}

    if (!this.appsvc.checkNetwork()){
      alert('There is no internet connection.');return;}
    this.varRegister.deviceid=this.appsvc.getDeviceID(this.device);
    this.varRegister.varDisable=this.appsvc.disableAllCtrl();
    this.subsRegisterApp=this.datasvc.RegisterApp(this.varRegister)
    .subscribe(
      (data:any)=>{
        if (data.resultmsg=='valid'){
          this.saveSettings(data);
          this.varRegister.varInfo='App is registered successfully';
        }else {
         this.varRegister.varDisable= this.appsvc.enableAllCntrl();
          this.varRegister.varInfo=data.resultmsg;}
       },
      Error=>{this.appsvc.errorHandler(Error);}
    );
   }

   saveSettings(parRegdata:any){
      this.sqlHlperSvc.createTable(this.sqlHlperSvc._createSettingTbl)
      .then((data:any)=>{
        let varlocSettings:ISettings={Username:this.varRegister.username,Useremail:this.varRegister.youremail, Regemail:this.varRegister.regemail,Offline:1,WebapiBaseURL:parRegdata.appwebapibaseurl,AzureStorageContainer:parRegdata.AzureStorageContainer};
        //varlocSettings.Offline=(this.varSetting.offline)?1:0;
        this.sqlHlperSvc.saveSettings(varlocSettings);
        AppService.setSettings(varlocSettings);
        this.varRegister.varDisable=this.appsvc.enableAllCntrl();
    })
      .catch((error:Error)=>{
        alert('109:Error while creating the Settings table.');
        this.appsvc.errorHandler(error);this.varRegister.varDisable=this.appsvc.enableAllCntrl();});
    }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(RegisterPopoverPage,);
    popover.present({
      ev: myEvent
    });
  }
    
}
