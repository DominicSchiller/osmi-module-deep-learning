import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-ea1-help',
  templateUrl: './ea1-help.page.html',
  styleUrls: ['./ea1-help.page.scss'],
})
export class Ea1HelpPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
