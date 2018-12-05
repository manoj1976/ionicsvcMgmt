import { DateTime } from "ionic-angular/components/datetime/datetime";

export class LoginAccount{
    code:string;
    name:string;
    password:string;
    blocked:boolean;
    expirydt:string;
    changepwdatnextlogon:boolean;
}