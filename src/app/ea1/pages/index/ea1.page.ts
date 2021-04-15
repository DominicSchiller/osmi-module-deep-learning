import { Component, OnInit } from '@angular/core';
import { Ml5ClassificationService } from 'src/app/ea1/services/ml5-classification/ml5-classification.service';

@Component({
  selector: 'app-ea1',
  templateUrl: './ea1.page.html',
  styleUrls: ['./ea1.page.scss'],
})
export class Ea1Page implements OnInit {

  private isML5ServiceReady: Boolean = false

  constructor(private ml5Service: Ml5ClassificationService) { 

    ml5Service.ready().then(isReady => {
      console.info("Page EA #1: ML5 ervice ready");
      this.isML5ServiceReady = isReady;
    });

  }

  ngOnInit() {
  }
}
