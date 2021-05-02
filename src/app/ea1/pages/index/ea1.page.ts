import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ml5ClassificationService } from 'src/app/ea1/services/ml5-classification/ml5-classification.service';
import { EA1HelpPage } from '../ea1-help/ea1-help.page';

@Component({
  selector: 'app-ea1',
  templateUrl: './ea1.page.html',
  styleUrls: ['./ea1.page.scss'],
})
export class EA1Page implements OnInit {

  public isML5ServiceReady: Boolean = false

  constructor(private ml5Service: Ml5ClassificationService, public modalController: ModalController) { 

    ml5Service.ready().then(isReady => {
      this.isML5ServiceReady = isReady;
    });

  }

  ngOnInit(): void {
  }

  async showHelpModal() {
    const modal = await this.modalController.create({
      component: EA1HelpPage,
      swipeToClose: true,
      cssClass: 'ea1-help-modal'
    });
    return await modal.present();
  }
}
