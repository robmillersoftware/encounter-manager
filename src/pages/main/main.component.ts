import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavigationService } from '@shared/services';
import { TabsPage } from '@pages';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  public rootPage: any = TabsPage;
  public headerData: any;

  constructor(public navCtrl: NavController, private navigationService: NavigationService) {
    this.navigationService.headerData.subscribe(data => {
      this.headerData = data;
    });
  }
}
