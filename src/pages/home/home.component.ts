import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserService, CampaignService, ConnectionService } from '@shared/services';
import { HomeViewComponent } from './views';
import { HomeDirective } from './home.directive';
import { HomeService, HomeViews } from './home.service';

/**
* This class contains the logic and several views for the home page of the application.
* @author Rob Miller
* @copyright 2018
*/
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //This directive is the container for the various components that can be displayed
  @ViewChild(HomeDirective) homeHost: HomeDirective;

  //This represents information about the view currently being displayed
  private headerData: any;

  //This contains information about all of the home page views
  private headers: any;

  constructor(public navCtrl: NavController, public campaignService: CampaignService,
      public homeService: HomeService,  public userService: UserService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private connectionService: ConnectionService) {
    console.log("Home page is loaded.");
  }

  /**
  * We need to wait for the page to finish loading before we try to display the
  * dashboard. This is an Ionic lifecycle hook
  */
  ionViewDidLoad() {
    this.loadComponent(HomeViews.DASHBOARD);
  }

  /**
  * Switches to the specified component
  * @param name
  */
  private loadComponent(id: any) {
    let views = this.homeService.getViews();
    let viewToLoad = views.find((v) => v.id === id);

    if (!viewToLoad) {
      console.error('Unable to find view for state: ' + HomeViews[id]);
      return null;
    }

    //Loads the component under the home directive
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewToLoad.component);
    let viewContainerRef = this.homeHost.viewContainerRef;
    viewContainerRef.clear();

    //Create a reference to the view component and set its inputs
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<HomeViewComponent>componentRef.instance).name = viewToLoad.name;
    (<HomeViewComponent>componentRef.instance).id = viewToLoad.id;
    (<HomeViewComponent>componentRef.instance).data = viewToLoad.data;
    (<HomeViewComponent>componentRef.instance).callback = this.navTo.bind(this);

    //Switch to the proper view data
    this.headerData = viewToLoad.data;
  }

  /**
  * This method is passed in as a callback to the various views and handles navigation
  * between them
  * @param operation This is the operation to be performed
  * @param data This is data containing information about the operation
  */
  private navTo(operation: string, data: any) {
    switch(operation) {
      case 'tabChange':
        //Navigate back to the dashboard before changing tabs if we're coming from
        //loading or joining a campaign
        if (this.headerData.id === HomeViews.CAMPAIGN_LOAD
            || this.headerData.id === HomeViews.CAMPAIGN_JOIN) {
          this.loadComponent('dashboard');
        }
        if (data === 'campaign') {
          this.checkCurrentCampaign();
        }

        break;
      case 'viewChange':
        //A view change without data should return to the default (i.e. the dashboard)
        if (!data) {
          this.loadComponent('dashboard');
        } else {
          this.loadComponent(data);
        }
        break;
    }
  }

  /**
  * Checks the state of the currently loaded campaign. If one exists, then we navigate
  * to the Campaign tab and start advertising the campaign through the connection service.
  * This is called when the app first loads and after loading or joining a campaign
  */
  private async checkCurrentCampaign() {
    let current = await this.campaignService.getCurrentCampaign();

    if (current) {
      this.navCtrl.parent.select(1);
      this.connectionService.advertiseCampaign(current);
    }
  }
}
