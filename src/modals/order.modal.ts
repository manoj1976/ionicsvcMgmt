import { Customer } from './customer.modal';
export class Order{
    orderno:string;
    customer:Customer;
    ordercontact:string;
    orderref:string;
    prodcode:string;
    proddesc:string;
    uom:string;
    prodimage:string;
    unitprice:number;
    orderqty:number;
    amount:number;
    linetype:string;
    lineno:number;
    userid:string;
    orderdate:string;
    entrydt:string;//entry datetime
    sign:string;//signature
    sync:number; //0=false,1=true
    deviceid:string;
    syncmsg:string;
}