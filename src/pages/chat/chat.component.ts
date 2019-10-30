import { Component, ViewChild } from '@angular/core';
import { Slides, ModalController, NavController } from 'ionic-angular';
import { CreateConversationModal } from '@pages/chat/modals';
import { Campaign, Conversation } from '@shared/objects';
import { UserStorage } from '@shared/persistence';
import { ChatService, CampaignService } from '@shared/services';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Slides) slides: Slides;

  public conversationType: string = "ingame";
  public inGameConversations: Array<Conversation>;
  public metaConversations: Array<Conversation>;
  public currentCampaign: Campaign;
  public currentConversation: Conversation;
  public hideOverlay: boolean = true;

  constructor(public navCtrl: NavController, public chatService: ChatService,
      public user: UserStorage, public campaignService: CampaignService, public modalCtrl: ModalController) {
    this.inGameConversations = new Array<Conversation>();
    this.metaConversations = new Array<Conversation>();

    this.chatService.subscribeToConversations(convos => {
      if (convos) {
        convos.forEach(convo => {
          if (convo.isMeta) {
            this.metaConversations.push(convo);
          } else {
            this.inGameConversations.push(convo);
          }
        });
      }
    });

    this.currentCampaign = this.campaignService.getCurrentCampaign();
  }

  ngOnInit(): void {
    this.slides.ionSlideProgress.subscribe(progress => this.onProgress(progress));
    this.slides.ionSlideTouchStart.subscribe(() => this.toggleTransitions(false));
    this.slides.ionSlideTouchEnd.subscribe(() => this.toggleTransitions(true));
  }

  private toggleTransitions(enable: boolean): void {
  }

  private onProgress(centerX: number): void {
  }

  public showCreateConversationDialog(isMeta:boolean) {
    let modal = this.modalCtrl.create(CreateConversationModal,
      {campaign: this.currentCampaign, isMeta: isMeta});
    this.hideOverlay = false;

    modal.present();
    modal.onDidDismiss(data => {
      this.hideOverlay = true;
      if (data.didSubmit) {
        console.log("Creating new conversation isMeta=" + data.isMeta + " with participants: " + data.participants.length);
        this.currentConversation = this.chatService.startConversation(data.isMeta, data.participants);
        this.slides.slideNext();
      }
    });
  }
}
