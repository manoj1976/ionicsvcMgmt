//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
//import { Customer } from './../modals/customer.modal';
//import { Order } from './../modals/order.modal';
//import { Product } from './../modals/product.modal';
import {Injectable } from '@angular/core';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import  {ISettings} from '../interfaces/settings.interface';
import  {IUser} from '../interfaces/user.interface';
import { ToastController } from 'ionic-angular';
import { CurrencyPipe } from '@angular/common';
import { Device } from '@ionic-native/device';

//import { ElementSchemaRegistry } from '@angular/compiler';
import { Network } from '@ionic-native/network';

@Injectable()
export class AppService{

    private static varOffline;static  varSettings:ISettings;
    private static varUser:IUser;//static orderCart:Array<Order>=[]
    
    constructor(private network:Network){}

    errorHandler(varErrorobj:any){
        if (!this.isNull(varErrorobj))
        if (!this.isNull(varErrorobj.message))
            alert(varErrorobj.message);
        else
            alert(varErrorobj);
    }

    static  setOffline(parOffline:boolean){
        this.varOffline=parOffline;
    }

    static isOffline(){return this.varOffline;}

    isNull(parObj):boolean{
        if ((parObj==undefined) || (parObj==''))
          return true

          return false;
    }

    disableAllCtrl(){return true; }

    enableAllCntrl(){return false;}

     //static _webapibaseurl='';
    static  setSettings(parSettings:ISettings){
        
        this.varSettings=parSettings;   
        if (parSettings.Offline==0)
            this.setOffline(false);
        else  //if value ==1
            this.setOffline(true); //offline
        
       // this._webapibaseurl=parSettings.WebapiBaseURL;
    }

    static getSettings():ISettings{
      /*  if (this.isNull(this.varSettings)){
          this.varSettings.WebapiBaseURL='';
          this.varSettings.Offline=0;
          this.setOffline(false);
        }*/
        return this.varSettings;
    }

    static getProdimagename(parProdimagename:string){
        if ((this.getSettings().AzureStorageContainer=='undefined') || (this.getSettings().AzureStorageContainer=='')){
          alert('Error 150: missing storage account setup');return;}


        return this.getSettings().AzureStorageContainer+parProdimagename 
        
    }

    static generalValidation():string{
        if (this.varSettings.WebapiBaseURL=='' ) return 'Please specify the WebAPI BaseURL in Settings page.';
        if ((this.varUser.UserID==undefined) || (this.varUser.UserID=='') ) return 'Login error. User id not found';
        return "";
    }

    getFormattedWebAPIURL(parURI):string{
        if (this.isNull(parURI)){
            alert('117:Blank Web API String.');return;}
        if (parURI.substring(parURI.length,parURI.length-1,1)=='/')
            return parURI+'api';
        else
            return  parURI+'/api';
    }
/*static getSettings(parSetting:string){
    if (parSetting=='webapibaseurl') return this._webapibaseurl;
}
*/

checkNetwork():boolean{
    //The type property will return one of the following connection types: unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
        //return this.network.type;
        if (this.network.type=='none') return false;

        return true;
}

static setUser(parUser:IUser){
 this.varUser=parUser;
 
}

static getUser(){
    return this.varUser;
}


getGuestUser():string{return 'GUEST';}

getAppID():string{return 'ORDER';}

getCompanyID():string{return 'PSC';}

getOwnerWebAPIURL():string{return 'https://mobileorderapi.azurewebsites.net/'}
/*
static addProductToOrder(parProduct:Product){
    let varOrder:Order=new Order();
    varOrder.orderno=this.getOrderno();
    varOrder.lineno=this.getNextcartlineno();
    varOrder.linetype='L';
    varOrder.prodcode=parProduct.code;
    varOrder.proddesc=parProduct.description;
    varOrder.uom=parProduct.uom;
    varOrder.prodimage=parProduct.prodimagename;
    varOrder.orderqty=parProduct.orderqty;
    varOrder.unitprice=parProduct.price;
    varOrder.amount= parProduct.orderqty*parProduct.price;
    this.orderCart.push(varOrder);
}

static addHeaderDetToOrder(parOrder:Order){
    let varOrder:Order=new Order(),varCreateHdr:boolean=true;
    for(let i=0;i<this.orderCart.length;i++){
        if (this.orderCart[i].linetype=='H'){
            varCreateHdr=false;
            parOrder.linetype='H';
            this.orderCart[i]=parOrder;
            break;
        }
    }
    if (varCreateHdr){
        parOrder.linetype='H';
        parOrder.orderno=this.getOrderno();
        this.orderCart.push(parOrder);
    }
}

assignOrderNo(deviceid:string,signURL:string):string{
    let varOrderno=AppService.getOrderno();
    let dt1=new Date();
    for(let i=0;i< AppService.orderCart.length;i++){
        AppService.orderCart[i].orderno=varOrderno;
        //AppService.orderCart[i].entrydt=dt1.getFullYear().toString()+'-'+dt1.getDate().toString()+'-'+(dt1.getMonth()+1).toString()+' '+dt1.getHours().toString()+':'+dt1.getMinutes().toString()+':'+dt1.getSeconds().toString();
        AppService.orderCart[i].entrydt=dt1.toISOString();
        if (AppService.orderCart[i].linetype=='H') {
            AppService.orderCart[i].lineno=0;
            AppService.orderCart[i].deviceid=deviceid;
            AppService.orderCart[i].userid=AppService.getUser().UserID;
            AppService.orderCart[i].sign=signURL;
           // AppService.orderCart[i].orderdate=dt1.getFullYear().toString()+'-'+dt1.getMonth().toString()+'-'+dt1.getDay().toString();
           AppService.orderCart[i].orderdate=dt1.toISOString();
        }
    }
    return varOrderno;
}

static getOrderno():string{
    let varOrderno:string='';
    for(let i=0;i< AppService.orderCart.length;i++)
        if (AppService.orderCart[i].linetype=='H') {
          varOrderno=AppService.orderCart[i].orderno;
          break;
        }

    if (varOrderno!='') return varOrderno;

    let dt1:Date=new Date();
    let str1:string=dt1.getDate().toString()+(dt1.getMonth()+1).toString()+dt1.getFullYear().toString()+dt1.getHours().toString()+dt1.getMinutes().toString()+dt1.getSeconds().toString();
    return AppService.getUser().UserID+'-'+str1;
}

static removeProdFromCart(parOrderitem:Order){
    this.orderCart.forEach( (element, index) => {
      if(element === parOrderitem){ this.orderCart.splice(index,1);return;}
    });
 }

 static updateCart(parOrderitem:Order){
    this.orderCart.forEach( (element, index) => {
        if(element === parOrderitem){ element.orderqty=parOrderitem.orderqty;return;}
      });
 }

 emptyCart(){
    AppService.orderCart=[];
 }

static getNextcartlineno():number{
    let lineno:number=0;
    this.orderCart.forEach(element => {
        if (element.lineno>lineno)
            lineno=element.lineno;
    });

    lineno+=1;return lineno;
}

validateOrder():string{
    let varmsg:string='';
    for(let i=0;i<AppService.orderCart.length;i++) {
        varmsg='Cart is empty.';
        if (AppService.orderCart[i].linetype=='L'){
            varmsg='';
            break;
        }
    }

    if (varmsg=='')
    for(let i=0;i<AppService.orderCart.length;i++) {
        if (AppService.orderCart[i].linetype=='H'){
            if (this.isNull(AppService.orderCart[i].customer)){
                varmsg='Invalid order. Empty customer details.';
                break;
            }
        }
    }
    
    return varmsg;
}


static getCart():Array<Order>{
 return this.orderCart;
}


static getCustomerFromtheCart():Customer{
    let varCust:Customer;
    for(let i=0;i< AppService.orderCart.length;i++)
        if (AppService.orderCart[i].linetype=='H'){
            varCust= AppService.orderCart[i].customer;
            break;
        }
    return varCust;
}
*/
showToastMessage(msg:string,toastCtrl:ToastController){
    let toast = toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  Round(number, precision):number {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  getCurrency(amount: number,currencyPipe:CurrencyPipe) {
    return currencyPipe.transform(amount, 'EUR', true, '1.2-2');
  }

  getDeviceID(device:Device):string
  {
    return device.uuid;
  }
/*
  calcCartTotalAmt():number{
      let orderTotal:number=0;
    for(let i=0;i<AppService.orderCart.length;i++) 
     if (AppService.orderCart[i].linetype=='L')
         orderTotal +=AppService.orderCart[i].amount;
    return orderTotal;
  }

  calcCartTotalQty():number{
    let orderTotalqty:number=0;
  for(let i=0;i<AppService.orderCart.length;i++)
  if (AppService.orderCart[i].linetype=='L') 
    orderTotalqty +=AppService.orderCart[i].orderqty;
  return orderTotalqty;
}

calcCartNoOfProduct():number{
    var unique =AppService.orderCart.filter(function (value, index, self) { 
        if (self[index].linetype=='L'){ //skip header rec.
            if (self[index].prodcode.indexOf(value.prodcode) === index) return false;  else return true;
        }else return false;
    });
    return unique.length;
}
*/
}