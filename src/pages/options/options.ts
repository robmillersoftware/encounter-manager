import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  headerData:any;
  
  constructor(public navCtrl: NavController) {
    this.headerData = { title: "Options" };
  }
}
