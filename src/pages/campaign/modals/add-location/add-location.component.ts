import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { LocationService, CampaignService } from '@shared/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location, Campaign } from '@shared/objects';

class LocCheckbox {
  constructor(public location: Location, public state: Boolean = false) {}
}

@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html'
})
export class AddLocationModal {
  public locations: FormGroup;
  public availableLocs: Array<LocCheckbox>;
  public campaign: Campaign;

  constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
      public campaignService: CampaignService, public locationService: LocationService) {
    this.availableLocs = new Array();
    this.campaign = this.campaignService.getCurrentCampaign();
    this.getLocations();
  }

  async getLocations() {
    let locations = this.locationService.getLocations();
    let available = Array.from(locations.values()).filter((loc: any) =>
      this.campaign.locations.findIndex(c => c.name === loc.name) < 0);

    available.forEach((loc: any) => {
      this.availableLocs.push(new LocCheckbox(loc));
    });
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  addLocations() {
    this.availableLocs.forEach((loc, idx) => {
      if (loc.state) {
        this.campaign.locations.push(loc.location);
        this.availableLocs.splice(idx, 1);
      }
    });

    this.campaignService.updateCampaign(this.campaign);
    this.closeModal(true);
  }
}
