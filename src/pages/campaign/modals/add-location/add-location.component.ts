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
    this.getLocations();
  }

  async getLocations() {
    this.locationService.getLocations().then(locations => {
      this.campaignService.getCurrentCampaign().then(campaign => {
        this.campaign = campaign;
        let available = Array.from(locations.values())
          .filter((loc: any) =>
            campaign.locations.findIndex(c => c.name === loc.name) < 0);

        available.forEach((loc: any) => {
          console.log("HELLO????" + loc.name);
          this.availableLocs.push(new LocCheckbox(loc));
        });
      });
    });
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }

  addLocations() {
    let obj = this;
    this.availableLocs.forEach((loc, idx) => {
      if (loc.state) {
        obj.campaign.locations.push(loc.location);
        this.availableLocs.splice(idx, 1);
      }
    });

    this.campaignService.updateCampaign(this.campaign).then(() => {
      obj.closeModal(true);
    });
  }
}