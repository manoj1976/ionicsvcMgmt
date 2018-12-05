import { errorHandler, INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser/src/browser';
import {Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Events } from 'ionic-angular';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AppService } from './app.service';
import { SQLiteHelperService } from './sqlitehelper.service';


@Injectable()
export class DataService{

    constructor(private http:Http,private appsvc:AppService,private sqlitehelperSvc:SQLiteHelperService,private event:Events){
    }
    
    
    getJobs():Array<any>{
        let joblist:Array<any>=[];
        let job={
        jobno:'J001',
        custName:'Payzone',
        Address1:'1, Orchard Avenue',
        Address2:'City west',
        City:'Tsallaght',
        County:'Dublin'
        }
        joblist.push(job);

        job={
            jobno:'J002',
            custName:'Gempack',
            Address1:'1, Orchard Avenue',
            Address2:'City west',
            City:'Tsallaght',
            County:'Dublin'
            }
            joblist.push(job);

            job={
                jobno:'J003',
                custName:"O'Briens",
                Address1:'1, Orchard Avenue',
                Address2:'City west',
                City:'Tsallaght',
                County:'Dublin'
                }
                joblist.push(job);
        return joblist;
        
    }

    getJobDetails(parJobno:string):Array<any>{
       let jobdetlist:Array<any>=[];
      
       let varJobdet={
        jobno:parJobno,
        taskno:'t001',
        description:'test... terminal',
        taskbillable:true,
        totaltime:'01:00',
        billabletime:'01:00',
        detmsg:'Detailed message'
      }
      jobdetlist.push(varJobdet);

      varJobdet={
        jobno:parJobno,
        taskno:'t002',
        description:'test2... terminal',
        taskbillable:true,
        totaltime:'01:00',
        billabletime:'01:00',
        detmsg:'Detailed message'
      }
      jobdetlist.push(varJobdet);

      return jobdetlist;
    }

    authUser(parUser:string,parPwd:string):Observable<any>{
        let url=this.appsvc.getFormattedWebAPIURL(AppService.getSettings().WebapiBaseURL);
        url=url+'/Authentication/AuthUser';
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin' ,'*');
        headers.append('Content-Type', 'application/json');
        var paramData = {
        userid:parUser,
        pwd:parPwd,
        type:''
        };
        return this.http.get(url,  {headers:headers,params:paramData})
                        .timeout(8000)//8 second
                        .map((data:any)=>data.json());
    }

    RegisterApp(parRegisterDet:any):Observable<any>{
        let url=this.appsvc.getFormattedWebAPIURL(this.appsvc.getOwnerWebAPIURL());
        url=url+'/RegisterApp';
        let headers = new Headers();
        //headers.append('Access-Control-Allow-Origin' ,'*');
        headers.append('Content-Type', 'application/json');
        var paramData = {
        username:parRegisterDet.username,
        useremail:parRegisterDet.youremail,
        regemail:parRegisterDet.regemail,
        appid:this.appsvc.getAppID(),
        compid:this.appsvc.getCompanyID(),
        deviceid:parRegisterDet.deviceid
        };
        return this.http.get(url,  {headers:headers,params:paramData})
                        .map((data:any)=>data.json());
    }
}
