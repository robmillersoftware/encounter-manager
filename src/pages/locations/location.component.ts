import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationDirective } from './location.directive';
import { LocationViewComponent } from './views/location-view.component';
import { LocationView } from './views/location-view';
import { LocationService } from './location.service';

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})
export class LocationPage {
  views: LocationView[];
  @ViewChild(LocationDirective) locationHost: LocationDirective;
  headerData:any;
  state:string;

  constructor(private service: LocationService, private componentFactoryResolver: ComponentFactoryResolver, public navCtrl: NavController, public navParams: NavParams) {
    this.headerData = { title: "Location" };
    this.state = navParams.get('state');
  }

  ionViewDidLoad() {
    this.views = this.service.getViews();
    this.loadComponent(this.state);
  }

  loadComponent(state: string) {
    let viewToLoad = this.views.find((v) => v.name.toLowerCase() === state.toLowerCase());

    if (!viewToLoad) {
      console.error('Unable to find view for location state: ' + state);
      return null;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewToLoad.component);
    
    let viewContainerRef = this.locationHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<LocationViewComponent>componentRef.instance).name = viewToLoad.name;
    (<LocationViewComponent>componentRef.instance).data = viewToLoad.data;
    (<LocationViewComponent>componentRef.instance).callback = this.onNotify.bind(this);
  }

  onNotify(message: string) {
    this.loadComponent(message);
  }
}
