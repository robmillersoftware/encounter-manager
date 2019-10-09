import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CampaignService } from '@shared/services';
import { Campaign, Player } from '@shared/objects';

@Component({
  selector: 'page-create-convo',
  templateUrl: 'create-convo.html'
})
export class CreateConversationModal {
  public conversationInfo: FormGroup;
  public campaign: Campaign;
  public possibleParticipants: Array<any>;
  public isMeta: boolean;
  public gm: Player;
  public checkboxes: Map<string, boolean>;

  constructor(public viewCtrl: ViewController, private params: NavParams, private formBuilder: FormBuilder,
      public campaignService: CampaignService) {
    this.conversationInfo = this.formBuilder.group({
      conversationParticipants: this.formBuilder.array([])
    });

    this.campaign = this.params.get('campaign');
    this.isMeta = this.params.get('isMeta');
    this.gm = this.campaign.gm;

    if (this.isMeta) {
      let idx = this.campaign.players.findIndex(p => {
        //The only player with a null endpoint is the local user
        return p.endpoint === null;
      });

      this.possibleParticipants = this.campaign.players.splice(idx, 1);
    } else {
      this.possibleParticipants = this.campaign.characters;
    }

    console.log('PARTICIPANTS: ' + this.possibleParticipants.length);
    this.possibleParticipants.push(this.gm);
    this.checkboxes = new Map<string, boolean>();
  }

  public closeModal(didSubmit: boolean, participants?: Array<any>) {
    this.viewCtrl.dismiss({didSubmit: didSubmit, isMeta: this.isMeta, participants: participants});
  }

  public onChange(name: string, checked: boolean) {
    //this.checkboxes.set(name, checked);
    const checkboxes = <FormArray>this.conversationInfo.controls.conversationParticipants;

    if (checked) {
      checkboxes.push(new FormControl(name));
    } else {
      let index = checkboxes.controls.findIndex(x => x.value == name);
      checkboxes.removeAt(index);
    }
  }

  public setParticipants(form: any) {
    let participants = new Array<any>();

    const checkboxes = <FormArray>form.conversationInfo.controls.conversationParticipants;
    checkboxes.controls.forEach(control => {
      let stripped = control.value.replace(/\s+$/, '');
      let allParticipants;

      if (this.isMeta) {
        allParticipants = this.campaign.players;
      } else {
        allParticipants = this.campaign.characters;
      }

      allParticipants.forEach(p => {
        console.log("P- " + p.name.trim() + " === S:" + stripped.trim());
        if (p.name.trim() === stripped.trim()) {
          participants.push(p);
        }
      });
    });

    if (participants.length > 0) {
      let userPlayer = this.campaign.players.find(p => {
        return p.endpoint === null;
      });

      participants.push(userPlayer);
      this.closeModal(true, participants);
    }
  }
}
