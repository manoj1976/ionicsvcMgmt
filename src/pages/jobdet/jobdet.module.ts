import { NgModule } from '@angular/core';
import { IonicPageModule, NavParams } from 'ionic-angular';
import { JobdetPage } from './jobdet';

@NgModule({
  declarations: [
    JobdetPage,
  ],
  imports: [
    IonicPageModule.forChild(JobdetPage),
  ],
})
export class JobdetPageModule {
}
