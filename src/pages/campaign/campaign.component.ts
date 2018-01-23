import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CampaignDirective } from './campaign.directive';
import { CampaignViewComponent } from './views/campaign-view.component';
import { CampaignService } from './campaign.service';

@IonicPage()
@Component({
  selector: 'page-campaign',
  templateUrl: 'campaign.html'
})
export class CampaignPage {
  @ViewChild(CampaignDirective) campaignHost: CampaignDirective;
  headerData:any;
  state:string;

  constructor(private service: CampaignService, private componentFactoryResolver: ComponentFactoryResolver, public navCtrl: NavController, public navParams: NavParams) {
    this.headerData = { title: "Campaign" };
    this.state = navParams.get('state');
  }

  ionViewDidLoad() {
    this.loadComponent(this.state);
  }

  loadComponent(state: string) {
    let views = this.service.getViews();

    let viewToLoad = views.find((v) => v.name.toLowerCase() === state.toLowerCase());

    if (!viewToLoad) {
      console.error('Unable to find view for campaign state: ' + state);
      return null;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewToLoad.component);
    
    let viewContainerRef = this.campaignHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<CampaignViewComponent>componentRef.instance).name = viewToLoad.name;
    (<CampaignViewComponent>componentRef.instance).data = viewToLoad.data;
    (<CampaignViewComponent>componentRef.instance).callback = this.onNotify.bind(this);
  }

  onNotify(message: any) {
    if (typeof message === "string") {
      this.loadComponent(message);
    } else if (typeof message === "object") {
      this.service.currentCampaign = message;
      this.loadComponent('current');
    }
  }
}
