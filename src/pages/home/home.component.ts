import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ModalController, IonicPage, NavController, Events } from 'ionic-angular';
import { NavigationService, CampaignService } from '@shared/services';
import { NetworkingService } from '@networking';
import { UserStorage } from '@shared/persistence';
import { HomeViewComponent } from './views';
import { HomeDirective } from './home.directive';
import { HomeService, HomeViews } from './home.service';
import { CampaignFactory } from '@shared/objects';

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
  public headerData: any;
  private views: any;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public campaignService: CampaignService,
      public homeService: HomeService,  public userStorage: UserStorage,
      private componentFactoryResolver: ComponentFactoryResolver, private network: NetworkingService,
      private navService: NavigationService, private events: Events) {

    this.views = this.homeService.getViews();
    this.navService.headerData.subscribe((data) => {
      this.headerData = data;
    });

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
    let viewToLoad = this.views.find((v) => v.id === id);
    if (!viewToLoad) {
      console.error('Unable to find view for state: ' + id);
      return null;
    }

    console.log("Loading " + viewToLoad.name + " view");
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
    this.navService.setHeaderData(viewToLoad.data);
  }

  /**
  * This method is passed in as a callback to the various views and handles navigation
  * between them
  * @param operation This is the operation to be performed
  * @param data This is data containing information about the operation
  */
  private navTo(operation: string, id: any) {
    switch(operation) {
      case 'tabChange':
        //Currently we only handle tab changes to the Campaign tab. This can be
        //expanded later
        this.checkCurrentCampaign();
        break;
      case 'viewChange':
        //A view change without data should return to the default (i.e. the dashboard)
        if (!id) {
          this.loadComponent(HomeViews.DASHBOARD);
        } else {
          this.loadComponent(id);
        }
        break;
      default:
        this.loadComponent(HomeViews.DASHBOARD);
    }
  }

  /**
  * Checks the state of the currently loaded campaign. If one exists, then we navigate
  * to the Campaign tab and start advertising the campaign through the connection service.
  * This is called when the app first loads and after loading or joining a campaign
  */
  private checkCurrentCampaign() {
    let current = this.campaignService.getCurrentCampaign();

    if (current) {
      console.log("Current campaign is " + current.toString());
      this.navCtrl.parent.select(1);
      this.network.broadcast(CampaignFactory.toBroadcast(current));
    }
  }

  public handleMenu(title: string) {
    this.events.publish(title);
  }
}
