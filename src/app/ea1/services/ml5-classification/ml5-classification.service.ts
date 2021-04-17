import { Injectable } from '@angular/core';
import ml5 from 'ml5';
import { BehaviorSubject, Observable } from 'rxjs';
import { ML5ClassificationResult } from '../../model/ML5ClassificationResult';
import { ImageRepositoryService, ImageSource } from '../image-repository/image-repository.service';

@Injectable({
  providedIn: 'root'
})
export class Ml5ClassificationService {

  public classificationResults = new BehaviorSubject<ML5ClassificationResult[]>([])
  public getClassificationResultsObservable(): Observable<ML5ClassificationResult[]> {
    return this.classificationResults.asObservable()  
  }

  private selectedImage: ImageSource = null
  private isMobileNetReady = new BehaviorSubject<Boolean>(false)
  private mobilenet: any = null

  constructor(private imageRepo: ImageRepositoryService) {
    this.initService();
  }

  private async initService() {
    let that = this;
    this.mobilenet = ml5.imageClassifier('MobileNet', () => {
      that.onMobileNetModelReady()
    });

    this.imageRepo.getSelectedImageObservable().subscribe(selectedImage => {
      this.selectedImage = selectedImage
      if (this.isMobileNetReady.value) {
        this.predictSelectedImage();
      }
    });
  }

   private async predictSelectedImage() {
     let image = new Image();
     image.src = this.selectedImage.toString();

     let that = this
     this.mobilenet.classify(image, (error, results) => this.onPredicationResultsReceived(error, results));    
   }

   async onMobileNetModelReady() {
     this.isMobileNetReady.next(true);
     if (this.selectedImage != null) {
       this.predictSelectedImage();
     }
   }

   async onPredicationResultsReceived(error, results: ML5ClassificationResult[]) {
     if (error) {
      console.error(error);
     } else {
      this.classificationResults.next(results);
     }
   }

   ready(): Promise<Boolean> {
     return new Promise((resolve, reject) => {
       this.isMobileNetReady.asObservable().subscribe(isReady => {
         if (isReady) {
           resolve(isReady)
         }
       });
     });
   }
}
