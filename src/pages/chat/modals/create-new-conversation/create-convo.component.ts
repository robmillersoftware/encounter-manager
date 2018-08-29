import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CampaignService } from '@shared/services';
import { UserStorage } from '@shared/persistence';
import { Campaign, Player } from '@shared/objects';
import { parseIdentifier } from '@globals';

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
      public campaignService: CampaignService, private userStorage: UserStorage) {
    this.conversationInfo = this.formBuilder.group({
      conversationParticipants: ['']
    });

    this.campaign = this.params.get('campaign');
    this.isMeta = this.params.get('isMeta');
    this.gm = this.campaignService.getGm(this.campaign.name);

    if (this.isMeta) {
      let idx = this.campaign.players.findIndex(p => {
        let id = parseIdentifier(this.userStorage.getIdentifier());
        return p.name === id.name && p.endpoint === id.endpoint;
      });

      this.possibleParticipants = this.campaign.players.splice(idx, 1);
    } else {
      this.possibleParticipants = this.campaign.characters;
      this.possibleParticipants.push(this.gm);
    }

    this.checkboxes = new Map<string, boolean>();
  }

  public closeModal(didSubmit: boolean, participants?: Array<any>) {
    this.viewCtrl.dismiss({didSubmit: didSubmit, isMeta: this.isMeta, participants: participants});
  }

  public onChange(name: string, checked: boolean) {
    this.checkboxes.set(name, checked);
  }

  public async setParticipants() {
    let participants = new Array<any>();

    this.checkboxes.forEach((value, key) => {
      if (value) {
        let stripped = key.replace(/\s+$/, '');
        let allParticipants;

        if (this.isMeta) {
          allParticipants = this.campaign.players;
        } else {
          allParticipants = this.campaign.characters;
        }

        let participant = allParticipants.findIndex(p => p.name.trim() === stripped.trim());
        participants.push(participant);
      }
    })

    if (participants.length > 0) {
      let userPlayer = this.campaign.players.find(p => {
        let id = parseIdentifier(this.userStorage.getIdentifier());
        return p.name === id.name && p.endpoint === id.endpoint;
      });

      participants.push(userPlayer);
      this.closeModal(true, participants);
    }
  }
}
