import { StatusBar } from '@ionic-native/status-bar';
//import { OrderPage } from './../pages/order/order';
import { Order } from './../modals/order.modal';
import { Salesrep } from './../modals/salesrep.modal';
import { DataService } from './data.service';
import { Customer } from './../modals/customer.modal';
import { AppService } from './app.service';
import { ngContentDef } from '@angular/core/src/view/ng_content';
import {Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser/src/browser';
import { Connection } from '@angular/http/src/interfaces';
import { Product } from '../modals/product.modal';
import {ISettings} from '../interfaces/settings.interface';
import { LoginAccount } from '../modals/loginaccount.modal';
import { ProdCategory } from '../modals/prodcategory.model';
import { NavController, App, ToastController,Events } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
//declare var window : any;

@Injectable()
export class SQLiteHelperService{
    private db:SQLiteObject;
    private serviceBaseURL:string;private serviceAppRegBaseURL:string;


    public _createSettingTbl:string='create table if not exists settings(id integer primary key not null,username TEXT,useremail TEXT,regemail TEXT,serviceBaseURL TEXT,deviceID TEXT,regDate TEXT,regTime TEXT,companyID TEXT,companyName TEXT,offline integer,azurestoragecontainer TEXT)';
    
    public _createCustomerTbl:string='create table if not exists customer(code TEXT primary key not null, name TEXT,add1 TEXT,add2 TEXT,city TEXT,county TEXT,phone TEXT,repid TEXT,syncdt TEXT,currdt TEXT)';
    public _createProdCategoryTbl:string='create table if not exists productcategory(code TEXT primary key not null,description TEXT,syncdt TEXT,currdt TEXT)';
    public _createProductTbl:string='create table if not exists product(code TEXT primary key not null,description TEXT,detaileddesc TEXT,price decimal(12,2),uom TEXT,stock decimal(12,2),barcode TEXT,prodcategory TEXT,prodimagename TEXT,syncdt TEXT,currdt TEXT)';
    public _createLoginTbl:string='create table if not exists login(code TEXT primary key not null,name TEXT,password TEXT, blocked integer,changepwdatnextlogon integer,expirydt TEXT,syncdt TEXT,currdt TEXT)';
    public _createSalerepTbl:string='create table if not exists salesrep(code TEXT primary key not null,name TEXT,syncdt,currdt)';
    public _createSyncConfigTbl:string='create table if not exists syncConfig(code TEXT primary key not null,name TEXT,lastsyncdt TEXT)';
    private _createOrderTbl:string='create table if not exists [order](orderno TEXT not null,linetype TEXT not null, lineno INTEGER not null,custcode TEXT,custname TEXT,repid TEXT ,ordcontact TEXT,ordref TEXT,prodcode TEXT,proddesc TEXT,uom TEXT,unitprice decimal(12,2), orderqty decimal(10,2),amount decimal(12,2),userid TEXT,orderdate TEXT,entrydt TEXT,deviceid TEXT,sign TEXT, sync integer DEFAULT 0,syncmsg TEXT, PRIMARY KEY(orderno,linetype,lineno))';
    public _readSettingsSQL:string='Select serviceBaseURL,offline,azurestoragecontainer from settings where id=1';
    public _readOrderForSync:string='Select * from [order] where [sync]=0 order by [orderno],[linetype],[lineno]'
    public _readOrderForOrderView:string="Select orderno,custcode, custname, repid,orderdate,ordcontact,ordref,sign,sync,syncmsg from [Order] where linetype='H'"
    public _readOrderLineForOrderView:string="Select orderno,lineno,prodcode,proddesc,uom,unitprice,orderqty,amount from [Order] where linetype='L'"
    
    public _deleteOrder:string='delete from [Order] where ';
    //private _insertSettingsSQL:string='Insert into settings (id, serviceBaseURL, deviceID, regDate, regTime, companyID, companyName) values(';
    private _insertSettingsSQL:string='Insert into settings (id,username,useremail,regemail, serviceBaseURL, offline,azurestoragecontainer) values(';
    
    private _insertCustomerSQL:string='REPLACE into customer (code,name,add1,add2,city,county,phone,repid,syncdt,currdt) values(?,?,?,?,?,?,?,?,?,?)';
    private _insertProdCateSQL:string='REPLACE into productcategory (code,description,syncdt,currdt) values (?,?,?,?)';
    private _insertProductSQL:string='REPLACE into product (code,description,detaileddesc,price,stock,uom,prodcategory,barcode,prodimagename,syncdt,currdt) values (?,?,?,?,?,?,?,?,?,?,?)';
    private _insertLoginSQL:string='REPLACE into login (code,name,password,blocked,changepwdatnextlogon,expirydt,syncdt,currdt) values (?,?,?,?,?,?,?,?)';
    private _insertSalesrepSQL:string='REPLACE into salesrep(code,name,syncdt,currdt) values(?,?,?,?)';
    private _insertSyncConfig:string='REPLACE into syncConfig(code,name,lastsyncdt) values(?,?,?)';
    private _insertOrderHdrSQL:string='REPLACE into [order](orderno ,linetype , lineno,custcode ,custname,repid ,ordcontact ,ordref ,userid ,orderdate ,entrydt,deviceid,sign) values (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    private _insertOrderLineSQL:string='REPLACE into [order](orderno ,linetype , lineno,prodcode,proddesc ,uom, unitprice , orderqty ,amount ,entrydt) values(?,?,?,?,?,?,?,?,?,?)';
    

    //private _updateSyncConfigSQL:string='Update syncConfig Set lastsyncdt=? where code=?';
    private _updateSettingsSQL:string='Update settings set username=?, useremail=?, regemail=?, serviceBaseURL=?, offline=?, azurestoragecontainer=? where id=1'
    public _updateOrderSyncStatus:string="Update [order] set sync={0},syncmsg='{1}' where orderno='{2}'";

    private _deleteSettingTbl:string="Delete from settings";    
    public _dropCustomerTbl:string='Drop table if exists customer';
    public _dropProductCateTbl:string='Drop table if exists productcategory';
    public _dropProductTbl:string='Drop table if exists product';
    public _dropSettingsTbl:string ='Drop table if exists settings';
    public _dropOrderTbl:string='Drop table if exists [order]';
    public _dropLoginTbl:string ='Drop table if exists login';
    public _dropSalesrepTbl:string='Drop table if exists salesrep';
    private _openBracket='(';_txtSeperator="'";_comaChr=',';_closeBracket=')';
    
    constructor(private sqlite:SQLite,private  appsvc:AppService,private event:Events){
        this.openDatabase();
    }
    

    openDatabase(){
        let dbOptions={ name: "order.db", location: 'default'};
        /*
        this.db.openDatabase(dbOptions)
        .catch(er=>alert('ERROR:Database open.'))
        .then(ms=>{
            this.createTable(this._createSettingTbl).catch(er=>alert('ERROR:Create Table.'))
            .then(ms=>this.readSettings());
            
        });
        */
        this.sqlite.create(dbOptions)
        .then((db: SQLiteObject) =>{
            this.db=db;
            this.createTable(this._createSettingTbl)
            .catch(er=>alert('ERROR:Create Table.'))
            .then(ms=>this.readSettings());
        })
        .catch((er:Error)=>{alert('112:Error while opening the database');this.appsvc.errorHandler(er);});
        
    }

    createTable(_cmd:string){
      return  this.db.executeSql(_cmd,[]);
    }

    dropSettingTable(){
        /*return this.executeSQL(this._deleteSettingTbl)
        .catch(err=>alert('ERROR:Drop table.'))
        .then(msg=>alert('Settings are deleted'));
*/
        return this.db.executeSql(this._deleteSettingTbl,[])
        .catch(err=>alert('ERROR:Drop table.'))
        .then(msg=>alert('Settings are deleted'));
        
    }

    insert(){
        
    }

    executeSQL(_cmd:string){
      return  this.db.executeSql(_cmd,[]);
    } 

    writeRegistrationInfo(data){
        let str1:string;
        this.executeSQL(this._deleteSettingTbl)
        .catch(err=>alert('ERROR:Delete table.'))
        .then(msg=>{
            //str1=this._insertSettingsSQL+"1,'"+data.ServiceBaseURL+"','"+data.DeviceID+"','"+data.RegDate+"','"+data.RegTime+"','"+data.CompID+"','"+data.CompName+"')";
            str1=this._insertSettingsSQL+"1,'"+data.ServiceBaseURL+"','"+data.DeviceID+"','"+data.RegDate+"','"+data.RegTime+"','"+data.CompID+"','"+data.CompName+"')";
            this.executeSQL(str1)
            .catch(err=>alert('ERROR:Write table'))
            .then(msg=>alert('Registered successfully.'));
        }
        );
    }
    
    
    update(){}

    delete(){

    }

    getBaseServiceBaseURL(){
        //return this.serviceBaseURL
        return "http://mobileorderapi.azurewebsites.net/"
    }

    getBaseAppRegServiceBaseURL(){
        return this.serviceAppRegBaseURL;
    }

    updateLocalCustTable(parDwnldCustlist:Array<Customer>,syncStatus,parsyncStartDt:Date):boolean{
        let _success:boolean=true,i:number;
        parDwnldCustlist.forEach(element => {
            let curdt=new Date();i+=1;
            this.db.executeSql(this._insertCustomerSQL,
                [
                    element.code,
                    element.name,
                    element.add1,
                    element.add2,
                    element.city,
                    element.county,
                    element.phone,
                    element.repid,
                    parsyncStartDt.toISOString(),
                    curdt.toISOString()
                ])
                .then((data)=>{
                    if (i==parDwnldCustlist.length){
                        this.updateSyncConfig('CUSTOMER',parsyncStartDt);
                        setTimeout(()=> {
                            this.event.publish('onCustSynComplete','custsynccompleted');
                          }, 4000);
                    }

                })
                .catch((error:Error)=>{_success=false;
                    this.event.publish('onCustSynComplete','custsynccompleted');
                });
        });

        if (_success)
            syncStatus.push({tble:'Customer',status:'Success'});
        else
            syncStatus.push({tble:'Customer',status:'Error'});

        return _success;
    }

    updateLocalSalesrepTable(parDwnldSalesreplist:Array<Salesrep>,syncStatus,parsyncStartDt:Date):boolean{
        let _success:boolean=true,i:number=0;
        parDwnldSalesreplist.forEach(element => {
            let curdt=new Date();i+=1; 
            this.db.executeSql(this._insertSalesrepSQL,
                [
                    element.code,
                    element.name,
                    parsyncStartDt.toISOString(),
                    curdt.toISOString()
                ])
                .then((data)=>{
                    if (i==parDwnldSalesreplist.length){
                        this.updateSyncConfig('SALESREP',parsyncStartDt);
                        setTimeout(()=> {
                            this.event.publish('onSalerepSynComplete','salesrepsynccompleted');
                          }, 4000);
                    }
                 })
                .catch((error:Error)=>{_success=false;
                    this.event.publish('onSalerepSynComplete','salesrepsynccompleted');
                });
        });

        if (_success)
            syncStatus.push({tble:'Salesrep',status:'Success'});
        else
            syncStatus.push({tble:'Salesrep',status:'Error'});

        return _success;
    }

    updateSyncConfig(parTbl:string,parsyncStartDt:Date){
        let varDesc:string='';
        if (parTbl=='CUSTOMER')
            varDesc='Customer';
        else if (parTbl=='PRODUCT')
            varDesc='Product';
        else if (parTbl=='LOGIN')
            varDesc='Login';
            this.db.executeSql(this._insertSyncConfig,
                [
                    parTbl,
                    varDesc,
                    parsyncStartDt.toISOString()
                ])
                .then((data)=>{})
                .catch((error:any)=>{alert('103:Error while updating syncConfig.');
                                     this.appsvc.errorHandler(error);})
    }

//Updating Product Category table
    updateLocalProdCateTable(parDwnldProdCatelist:Array<ProdCategory>,syncStatus,parsyncStartDt:Date):boolean{
        let _success:boolean=true,i:number;
        parDwnldProdCatelist.forEach(element => {
            let curdt=new Date();i+=1;
            this.db.executeSql(this._insertProdCateSQL,
                [
                 element.code,
                 element.description,
                 parsyncStartDt.toISOString(),
                 curdt.toISOString()
                ])
                .then((data)=>{
                    if (i==parDwnldProdCatelist.length){
                        this.updateSyncConfig('PRODCATEGORY',parsyncStartDt);
                        setTimeout(()=> {
                            this.event.publish('onProdCateSyncComplete','prodcatesynccompleted');
                          }, 4000);
                    }
                })
                .catch((error:Error)=>{_success=false;
                    this.event.publish('onProdCateSyncComplete','prodcatesynccompleted');
                    });
        });

        if (_success)
            syncStatus.push({tble:'ProductCategory',status:'Success'});
        else
            syncStatus.push({tble:'ProductCategory',status:'Error'});

        return _success;
    }

    updateLocalProdTable(parDwnldProdlist:Array<Product>,syncStatus,parsyncStartDt:Date):boolean{
        let _success:boolean=true,i:number;
        parDwnldProdlist.forEach(element => {
            let curdt=new Date();i+=1;
            this.db.executeSql(this._insertProductSQL,
                [
                 element.code,
                 element.description,
                 element.detaileddesc,
                 element.price,
                 element.stock,
                 element.uom,
                 element.prodcategory,
                 element.barcode,
                 element.prodimagename,
                 parsyncStartDt.toISOString(),
                 curdt.toISOString()
                ])
                .then((data)=>{
                    if (i==parDwnldProdlist.length){
                        this.updateSyncConfig('PRODUCT',parsyncStartDt);
                        setTimeout(()=> {
                            this.event.publish('onProdSyncComplete','prodsynccompleted');
                          }, 4000);
                    }
                })
                .catch((error:Error)=>{_success=false;
                    this.event.publish('onProdSyncComplete','prodsynccompleted');
                    });
        });

        if (_success)
            syncStatus.push({tble:'Product',status:'Success'});
        else
            syncStatus.push({tble:'Product',status:'Error'});

        return _success;
    }

    updateLocalLoginTable(parDwnldLoginlist:Array<LoginAccount>,syncStatus,parsyncStartDt:Date):boolean{
        let _success:boolean=true,i:number;let str1:string;
        let varblocked=0;let varchngpwdatnextlogon=0;
        parDwnldLoginlist.forEach(element => {
            let curdt=new Date();i+=1;
            if (element.blocked) varblocked=1;
            if (element.changepwdatnextlogon) varchngpwdatnextlogon=1;
            this.db.executeSql(this._insertLoginSQL,
                [
                    element.code,
                    element.name,
                    element.password,
                    varblocked,
                    varchngpwdatnextlogon,
                    element.expirydt,
                    parsyncStartDt.toISOString(),
                    curdt.toISOString()
                ])
                .then((data)=>{
                    if (i==parDwnldLoginlist.length){
                        this.updateSyncConfig('LOGIN',parsyncStartDt);
                        setTimeout(()=> {
                            this.event.publish('onLoginSyncComplete','loginsynccompleted');
                          }, 4000);
                    }

                })
                .catch((error:Error)=>{_success=false;
                    this.event.publish('onLoginSyncComplete','loginsynccompleted');
                    });
        });    
        if (_success)
            syncStatus.push({tble:'Login',status:'Success'});
        else
            syncStatus.push({tble:'Login',status:'Error'});

        return _success;
    }
    
    readSettings_OLD(){
        //this.serviceBaseURL='http://nav2017new1.northeurope.cloudapp.azure.com/WMSApi/';
        this.serviceAppRegBaseURL='http://nav2017new1.northeurope.cloudapp.azure.com/WMSApi/';
        return this.db.executeSql(this._readSettingsSQL,[])
        .catch(err=>alert('ERROR:Read table.'))
        .then(response=>{
            
            let varRegRequired=false;
            if (response==undefined) varRegRequired =true;
            if (response==null) varRegRequired =true;
            if (response.rows==undefined) varRegRequired=true;
            if (response.rows==null) varRegRequired=true;
            if ((!varRegRequired) && (response.rows.length==0)) varRegRequired=true;
            


            for(let i=0;i<response.rows.length;i++){
                this.serviceBaseURL=response.rows.item(i).serviceBaseURL;
            }
        }
        );
    
    }
    
    readSettings():ISettings{
        let varSettings:ISettings={WebapiBaseURL:'',Offline:0,Username:'',Useremail:'',Regemail:'',AzureStorageContainer:''};

        this.db.executeSql(this._readSettingsSQL,[])
        .then((response:any)=>
        {
            if (response.rows.length==0) {
                //alert('Please complete the setup in Settings page');return;
                alert('Please register the app.');return;
            }

                for(let i=0;i<response.rows.length;i++){
                    varSettings.Offline=response.rows.item(i).offline;
                    varSettings.WebapiBaseURL =response.rows.item(i).serviceBaseURL;
                    varSettings.AzureStorageContainer=response.rows.item(i).azurestoragecontainer;
                }
                //this.appsvc.setSettings(varSettings);
                AppService.setSettings(varSettings);
        })
        .catch((error:Error)=>{alert('108:Error while reading setting table.');
        this.appsvc.errorHandler(error);})
               
        return varSettings;
    }
    
    saveSettings(parSettings:ISettings){
        this.db.executeSql(this._readSettingsSQL,[])
        .then(data=>{
            if (data.rows.length==0) 
               this.insertSettings(parSettings);
            else this.updateSettings(parSettings);
        
        })
        .catch((error:Error)=>{alert('109:Error while saving settings.'); this.appsvc.errorHandler(error);
    });
    }

    private insertSettings(parSettings:ISettings){
        let str1:string=this._insertSettingsSQL;
        str1+='1'+this._comaChr+
        this._txtSeperator+parSettings.Username+this._txtSeperator+this._comaChr+
        this._txtSeperator+parSettings.Useremail+this._txtSeperator+this._comaChr+
        this._txtSeperator+parSettings.Regemail+this._txtSeperator+this._comaChr+
        this._txtSeperator+ parSettings.WebapiBaseURL+this._txtSeperator+this._comaChr+
        parSettings.Offline+this._comaChr+
        this._txtSeperator+ parSettings.AzureStorageContainer+this._txtSeperator+
        this._closeBracket;
        this.executeSQL(str1)
        .then(msg=>{})
        .catch(err=>{alert('110:Error while inserting into settings table'); this.appsvc.errorHandler(err);});
    }

    private updateSettings(parSettings:ISettings){
        this.db.executeSql(this._updateSettingsSQL,[parSettings.Username,parSettings.Useremail,parSettings.Regemail,parSettings.WebapiBaseURL,parSettings.Offline,parSettings.AzureStorageContainer])
        .then()
        .catch((error:Error)=>{alert('111:Error while updating the settings.'); this.appsvc.errorHandler(error);
        });

    }

    findProductByBarcode(parBarcode:string):boolean{
        let str1:string="select * from product where barcode='"+parBarcode+"'";
        let product:Product=new Product;
        this.db.executeSql(str1,[])
        .then((response:any)=>
        {
            if (response.rows.length==0) 
                return false ;

            for(let i=0;i<response.rows.length;i++){
                product.code=response.rows.item(i).code;
                product.description=response.rows.item(i).description;
                product.detaileddesc=response.rows.item(i).detaileddesc;
                product.price=response.rows.item(i).price;
                product.prodcategory=response.rows.item(i).prodcategory;
                product.prodimagename=response.rows.item(i).prodimagename;
                product.stock=response.rows.item(i).stock;
                product.uom=response.rows.item(i).uom;
                product.orderqty=1;
                //AppService.addProductToOrder(product);
                return true;
            }
        })
        .catch((error:Error)=>{alert('118:Error while reading product table.');
        this.appsvc.errorHandler(error);})
               
        return false ;
    }

    saveOrderToLocalDB(app:App,parOrderno:string,toastCtrl:ToastController){
        this.createTable(this._createOrderTbl)
        .then(data=>{
            let str1:string="delete from [order] where orderno='"+parOrderno+"'"
            this.executeSQL(str1)
            .then(data=>this._saveOrderToLocalDB(app,toastCtrl))
            .catch(error=>{
                alert('216:Error while deleting the order');
                this.appsvc.errorHandler(error);return;
             })
            }
        )
        .catch(error=>{ 
          alert('200:Error while creating the order table.')
          this.appsvc.errorHandler(error);return;})
    }

    private _saveOrderToLocalDB(app:App,toastCtrl:ToastController){
        let i:number=0;
        /*AppService.orderCart.forEach(element => {
            if (element.linetype=='H')
                    this.db.executeSql(this._insertOrderHdrSQL,
                        [
                            element.orderno,
                            element.linetype,
                            element.lineno,
                            element.customer.code,
                            element.customer.name,
                            element.customer.repid,
                            element.ordercontact,
                            element.orderref,
                            element.userid,
                            element.orderdate,
                            element.entrydt,
                            element.deviceid,
                            element.sign
                        ])
                        .then((data)=>{
                            i+=1;
                            if (i==(AppService.orderCart.length-1))
                                this.runAfterOrderSave(app,toastCtrl);
                        })
                        .catch((error:Error)=>{this.appsvc.errorHandler(error)});
            else  //line
                this.db.executeSql(this._insertOrderLineSQL,
                    [
                        element.orderno,
                        element.linetype,
                        element.lineno,
                        element.prodcode,
                        element.proddesc,
                        element.uom,
                        element.unitprice,
                        element.orderqty,
                        element.amount,
                        element.entrydt,
                    ])
                    .then((data)=>{
                        i+=1;
                       // if (i==(AppService.orderCart.length-1))
                          //  this.runAfterOrderSave(app,toastCtrl);
                    })
                    .catch((error:Error)=>{this.appsvc.errorHandler(error)});
            });*/
    }   

    private runAfterOrderSave(app:App,toastCtrl:ToastController){
        //this.appsvc.emptyCart();
        this.appsvc.showToastMessage('The order is successfully saved.',toastCtrl);
        app.getRootNav().setRoot(HomePage);
        
    }
}

