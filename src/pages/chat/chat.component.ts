import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  private headerData: any;

  constructor(public navCtrl: NavController, public user: UserService) {
    this.headerData = { title: "Campaign Chat" };
  }
}