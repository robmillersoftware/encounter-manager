import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CharacterDirective } from './character.directive';
import { CharacterViewComponent } from './views/character-view.component';
import { CharacterView } from './views/character-view';
import { CharacterService } from './character.service';

@IonicPage()
@Component({
  selector: 'page-character',
  templateUrl: 'character.html'
})
export class CharacterPage {
  views: CharacterView[];
  @ViewChild(CharacterDirective) characterHost: CharacterDirective;
  headerData:any;
  state:string;

  constructor(private service: CharacterService, private componentFactoryResolver: ComponentFactoryResolver, public navCtrl: NavController, public navParams: NavParams) {
    this.headerData = { title: "Character" };
    this.state = navParams.get('state');
  }

  ionViewDidLoad() {
    this.views = this.service.getViews();
    this.loadComponent(this.state);
  }

  loadComponent(state: string) {
    let viewToLoad = this.views.find((v) => v.name === state);

    if (!viewToLoad) {
      console.error('Unable to find view for character state: ' + state);
      return null;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewToLoad.component);
    
    let viewContainerRef = this.characterHost.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<CharacterViewComponent>componentRef.instance).name = viewToLoad.name;
    (<CharacterViewComponent>componentRef.instance).data = viewToLoad.data;
  }
}
