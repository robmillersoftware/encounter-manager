import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-testing-controls',
  templateUrl: 'testing-controls.html'
})
export class TestingControlsModal {
  public userName: string;
  constructor(public viewCtrl: ViewController) {
  }

  public closeModal(didSubmit: boolean) {
    this.viewCtrl.dismiss(didSubmit);
  }
}
