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


@Injectable()
export class DataService{

    constructor(private http:Http,private event:Events){
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
}
