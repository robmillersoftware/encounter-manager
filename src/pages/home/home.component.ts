import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserService, CampaignService } from '@shared/services';
import { HomeViewComponent } from './views';
import { HomeDirective } from './home.directive';
import { HomeService } from './home.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(HomeDirective) homeHost: HomeDirective;

  private headerData: any;
  private headers: any;

  constructor(public navCtrl: NavController, public campaignService: CampaignService,
      public homeService: HomeService,  public userService: UserService,
      private componentFactoryResolver: ComponentFactoryResolver) {
    this.headers = {
      dashboard: { title: 'Encounter Manager' },
      campaignjoin: { title: 'Join a Campaign', canGoBack: true },
      campaignload: { title: 'Load an Existing Campaign', canGoBack: true },
      campaignnew: { title: 'Create a New Campaign', canGoBack: true },
      characteredit: { title: 'Edit Existing Characters', canGoBack: true },
      characternew: { title: 'Create a New Character', canGoBack: true },
      locationedit: { title: 'Edit Existing Locations', canGoBack: true },
      locationnew: { title: 'Create a New Location', canGoBack: true }
    };

    this.headerData = this.headers.dashboard
  }

  ionViewDidLoad() {
    this.loadComponent("dashboard");
  }

  loadComponent(name: string) {
    let views = this.homeService.getViews();
    let viewToLoad = views.find((v) => v.name.toLowerCase() === name.toLowerCase());

    if (!viewToLoad) {
      console.error('Unable to find view for state: ' + name);
      return null;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewToLoad.component);

    let viewContainerRef = this.homeHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<HomeViewComponent>componentRef.instance).name = viewToLoad.name;
    (<HomeViewComponent>componentRef.instance).data = viewToLoad.data;
    (<HomeViewComponent>componentRef.instance).callback = this.navTo.bind(this);

    this.headerData = this.headers[viewToLoad.name.replace('-', '')];
  }

  navTo(operation: string, data: any) {
    switch(operation) {
      case 'tabChange':
        if (this.headerData.campaignload) {
          this.loadComponent('dashboard');
        }
        if (data === 'campaign') {
          this.checkCurrentCampaign();
        }

        break;
      case 'pageChange':
        if (!data) {
          this.loadComponent('dashboard');
        } else {
          if (data.campaign) {
            this.userService.setCurrentCampaign(data.campaign).then(() => {
              this.loadComponent('dashboard');
            });
          } else {
            this.loadComponent(data);
          }
        }
        break;
    }
  }

  private async checkCurrentCampaign() {
    let current = await this.campaignService.getCurrentCampaign();

    if (current) {
      this.navCtrl.parent.select(1);
    }
  }
}
