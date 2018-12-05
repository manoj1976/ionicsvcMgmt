//import { CustomerFilterPipe } from './../filters/customer.filter';
import { Order } from './../modals/order.modal';
import { SQLiteHelperService } from './sqlitehelper.service';
import { Salesrep } from './../modals/salesrep.modal';
import { LoginAccount } from './../modals/loginaccount.modal';
import { Injectable, ErrorHandler } from '@angular/core';
import {Http,Headers,RequestOptions} from '@angular/http';
import {Events} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {StringBuilder, String} from 'typescript-string-operations';
import { ToastController } from 'ionic-angular';

import {Customer} from '../modals/customer.modal'
import {Product} from '../modals/product.modal';
import { Response } from '@angular/http/src/static_response';
import { AppService } from './app.service';
import { ProdCategory } from '../modals/prodcategory.model';
import { SQLite } from '@ionic-native/sqlite';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { OrderSyncResult } from '../modals/ordersyncresult.model';
import { elementDef } from '@angular/core/src/view/element';
import { Element } from '@angular/compiler';


@Injectable()
export class SyncMgmtService{
    //constructor(private http:Http,private sqlitehelperSvc:SQLiteHelperService){
    constructor(private http:Http,private appsvc:AppService,private sqlitehelperSvc:SQLiteHelperService,private event:Events){
    }

    syncCustomer(synctype:string,lastsyncdt:string):Observable<Customer[]>{
        //let url=this.sqlitehelperSvc.getBaseServiceBaseURL()+'api/Sync/Customer';
        //let url='https://mobileorderapi.azurewebsites.net/api/sync/customer?reqtype=reqtype&appid=appid&reqsource=reqsource&tag1=tag1'
        //let url='https://mobileorderapi.azurewebsites.net/api/Sync/Customer'; --correct format
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/Customer';
        //let url='http://localhost:8100/api/Sync/Customer';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        /*let paramData = new URLSearchParams();
        paramData.append('reqtype', 'customer');
        paramData.append('appid', 'OrderCapture');
        paramData.append('reqsource', 'sync');
        paramData.append('tag1', 'fullsync');
        let options = new RequestOptions({ headers: headers ,params:paramData});
        */
        var paramData = {
        reqtype:'customer',
        appid:'OrderCapture',
        reqsource:'sync',
        synctype:synctype,
        lastsyncdt:lastsyncdt
        };
            return this.http.get(url,  {headers:headers,params:paramData})
                .map((data:Response)=>data.json());
  
          /*       
          return this.http.get(url,  options)
          .map((data:Response)=>data.json());
*/
    }
/*
    syncSalesrep(sqlHlperSvc:SQLiteHelperService):Observable<Salesrep[]>{
        let str1:string,synctype:string,lastsyncdttime:string;
        str1="Select lastsyncdt from syncConfig where code='SALESREP'";
        sqlHlperSvc.executeSQL(str1)
        .catch(err=>alert('155:ERROR:while reading the syncConfig table for SALESREP'))
        .then((response:any)=>{
            if (response.rows.length==0) {
                lastsyncdttime='1753-01-01 00:00:00';
                synctype='fullsync';
            }
            else{
                lastsyncdttime=response.rows.item(0).lastsyncdt;
                synctype='incrementalsync';
            }
            return this._syncSalesrep(synctype,lastsyncdttime);
        }
        );

        return new Observable<Salesrep[]>();
    }
*/
    syncSalesrep(synctype:string,lastsyncdt:string):Observable<Salesrep[]>{
        //let url=this.sqlitehelperSvc.getBaseServiceBaseURL()+'api/Sync/Customer';
        //let url='https://mobileorderapi.azurewebsites.net/api/sync/customer?reqtype=reqtype&appid=appid&reqsource=reqsource&tag1=tag1'
        //let url='https://mobileorderapi.azurewebsites.net/api/Sync/Customer'; --correct format
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/Salesrep';
        //let url='http://localhost:8100/api/Sync/Customer';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        /*let paramData = new URLSearchParams();
        paramData.append('reqtype', 'customer');
        paramData.append('appid', 'OrderCapture');
        paramData.append('reqsource', 'sync');
        paramData.append('tag1', 'fullsync');
        let options = new RequestOptions({ headers: headers ,params:paramData});
        */
        var paramData = {
        reqtype:'salesrep',
        appid:'OrderCapture',
        reqsource:'sync',
        synctype:synctype,
        lastsyncdt:lastsyncdt
        };
            return this.http.get(url,  {headers:headers,params:paramData})
                .map((data:Response)=>data.json());
  
          /*       
          return this.http.get(url,  options)
          .map((data:Response)=>data.json());
*/
    }



    syncProductCategory(synctype:string,lastsyncdt:string):Observable<ProdCategory[]>{
        //let url=this.sqlitehelperSvc.getBaseServiceBaseURL()+'api/Sync/Customer';
        //let url='https://mobileorderapi.azurewebsites.net/api/sync/productcategory?reqtype=reqtype&appid=appid&reqsource=reqsource&tag1=tag1'
        //let url='https://mobileorderapi.azurewebsites.net/api/Sync/productcategory'; --correct format
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/ProductCategory';
        //let url='http://localhost:8100/api/Sync/Product';
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin' ,'*');
        headers.append('Content-Type', 'application/json');
        var paramData = {
        reqtype:'productcategory',
        appid:'OrderCapture',
        reqsource:'sync',
        synctype:synctype,
        lastsyncdt:lastsyncdt
        };
            return this.http.get(url,  {headers:headers,params:paramData})
                .map((data:Response)=>data.json());
  
    }

    syncProduct(synctype:string,lastsyncdt:string):Observable<Product[]>{
        //let url=this.sqlitehelperSvc.getBaseServiceBaseURL()+'api/Sync/Customer';
        //let url='https://mobileorderapi.azurewebsites.net/api/sync/customer?reqtype=reqtype&appid=appid&reqsource=reqsource&tag1=tag1'
        //let url='https://mobileorderapi.azurewebsites.net/api/Sync/Product'; --correct format
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/Product';
        //let url='http://localhost:8100/api/Sync/Product';
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin' ,'*');
        headers.append('Content-Type', 'application/json');
        var paramData = {
        reqtype:'product',
        appid:'OrderCapture',
        reqsource:'sync',
        synctype:synctype,
        lastsyncdt:lastsyncdt
        };
            return this.http.get(url,  {headers:headers,params:paramData})
                .map((data:Response)=>data.json());
  
    }

    syncLogin(synctype:string,lastsyncdt:string):Observable<LoginAccount[]>{
        //let url=this.sqlitehelperSvc.getBaseServiceBaseURL()+'api/Sync/Customer';
        //let url='https://mobileorderapi.azurewebsites.net/api/sync/customer?reqtype=reqtype&appid=appid&reqsource=reqsource&tag1=tag1'
        //let url='https://mobileorderapi.azurewebsites.net/api/Sync/LoginAccount'; - correct format
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/LoginAccount';
        //let url='http://localhost:8100/api/Sync/Product';
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin' ,'*');
        headers.append('Content-Type', 'application/json');
        var paramData = {
        reqtype:'login',
        appid:'OrderCapture',
        reqsource:'sync',
        synctype:synctype,
        lastsyncdt:lastsyncdt
        };
            return this.http.get(url,  {headers:headers,params:paramData})
                .map((data:Response)=>data.json());
  
    }

    syncOrder(parSrc:string,toastCtrl: ToastController){
        if (!this.appsvc.checkNetwork()){
            this.appsvc.showToastMessage('No internet connection.',toastCtrl); 
            this.event.publish('onOrderSynComplete','ordersynccompleted');
            return;
          }

        let orderlist:Array<Order>=[];
        this.sqlitehelperSvc.executeSQL(this.sqlitehelperSvc._readOrderForSync)
        .then(data=>{
            let order:Order,cust:Customer;
            if (data.rows.length==0){ //if nothing to replicate
                this.event.publish('onOrderSynComplete','ordersynccompleted');
                return;
            }
            for(let i=0;i<data.rows.length;i++){
                order=new Order;cust=new Customer();
                order.orderno=data.rows.item(i).orderno;
                order.linetype=data.rows.item(i).linetype;
                order.lineno=data.rows.item(i).lineno;
                cust.code=data.rows.item(i).custcode;
                cust.name=data.rows.item(i).custname;
                cust.repid=data.rows.item(i).repid;
                order.customer=cust;
                order.ordercontact=data.rows.item(i).ordcontact;
                order.orderref=data.rows.item(i).ordref;
                order.userid=data.rows.item(i).userid;
                order.orderdate=data.rows.item(i).orderdate;
                order.entrydt=data.rows.item(i).entrydt;
                order.deviceid=data.rows.item(i).deviceid;
                order.prodcode=data.rows.item(i).prodcode;
                order.proddesc=data.rows.item(i).proddesc;
                order.uom=data.rows.item(i).uom;
                order.unitprice=data.rows.item(i).unitprice;
                order.orderqty=data.rows.item(i).orderqty;
                order.amount=data.rows.item(i).amount;
                order.sign=data.rows.item(i).sign;
                orderlist.push(order);
            }
            //if (parSrc.toLowerCase()=='syncpage')
            this._syncOrder(parSrc,orderlist);
        })
        .catch((error:Error)=>{alert('Error:504-Error in order sync');this.appsvc.errorHandler(error);
                this.event.publish('onOrderSynComplete','ordersynccompleted');
                });

    }

    private _syncOrder(parSrc:string,parOrderlist:Array<Order>){
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Sync/Order';
       
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body=JSON.stringify(parOrderlist);
        
        this.http.post(url,body,{headers:headers})
            .map((resp:Response)=>resp.json())
            .subscribe(
                (ordrSyncresult:Array<OrderSyncResult>)=>{
                  //  console.log(ordrSyncresult);
                 this._updateOrderSyncStatus(ordrSyncresult);
                },
                Error=>{
                    if (parSrc=='syncpage'){
                        alert(this.appsvc.errorHandler(Error));
                        this.event.publish('onOrderSynComplete','ordersynccompleted');
                    }
                }
            );
    }
   
    private _updateOrderSyncStatus(parOrderSyncRslt:Array<OrderSyncResult>){
        let str1:string;
        for(let i=0;i<parOrderSyncRslt.length;i++){
            setTimeout(()=> {
                str1=this.getOrderSyncStatusUpdateStr(parOrderSyncRslt[i]);
                this.sqlitehelperSvc.executeSQL(str1)
                    .then(data=>{
                        if (i==(parOrderSyncRslt.length-1))
                          this.event.publish('onOrderSynComplete','ordersynccompleted');
                    })
                    .catch((error:Error)=>{alert('Error:510-Error while updating order sync status');this.appsvc.errorHandler(error);});
              }, 3000);

            

        }
    }

    private getOrderSyncStatusUpdateStr(parOrdsyncrslt:OrderSyncResult):string{
        let str1:string, varSync:number;
        varSync=parOrdsyncrslt.success?1:0;
        str1 =String.Format(this.sqlitehelperSvc._updateOrderSyncStatus,varSync,parOrdsyncrslt.message,parOrdsyncrslt.orderno);
        return str1;
    }

}