import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CampaignService, UserService } from '@shared/services';
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
      public campaignService: CampaignService, public userService: UserService) {
    this.conversationInfo = this.formBuilder.group({
      conversationParticipants: this.formBuilder.array([])
    });

    this.campaign = this.params.get('campaign');
    this.isMeta = this.params.get('isMeta');
    this.gm = this.campaign.gm;

    if (this.isMeta) {
      let localPlayer: Player = null;
      let idx = this.campaign.players.findIndex(p => {
        //The only player with a null endpoint is the local user
        if (p.id === userService.getId()) {
          localPlayer = p;
          return true;
        }

        return false;
      });

      this.possibleParticipants = this.campaign.players.splice(idx, 1);

      if (localPlayer !== null && localPlayer.id !== this.gm.id) {
        this.possibleParticipants.push(this.gm);
      }
    } else {
      this.possibleParticipants = this.campaign.characters;
    }

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

    const checkboxes = <FormArray>form.form.controls.conversationParticipants;
    checkboxes.controls.forEach(control => {
      let stripped = control.value.replace(/\s+$/, '');
      let allParticipants;

      if (this.isMeta) {
        allParticipants = this.campaign.players;
        let userPlayer = this.campaign.players.find(p => {
          return this.userService.getId() === p.id;
        });

        participants.push(userPlayer);
      } else {
        //TODO: fix in-game chat for GMs and players with multiple characters
        allParticipants = this.campaign.characters;
      }

      allParticipants.forEach(p => {
        console.log("P- " + p.name.trim() + " === S:" + stripped.trim());
        if (p.name.trim() === stripped.trim()) {
          participants.push(p);
        }
      });
    });

    if (participants.length > 1) {
      console.log('STARTING CONVO WITH ' + participants.length + ' PLAYERS');
      this.closeModal(true, participants);
    } else {
      this.closeModal(false);
    }
  }
}
