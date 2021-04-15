import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageRepositoryService {

  private selectedImage: BehaviorSubject<ImageSource> = new BehaviorSubject(null)

  private allImages = new BehaviorSubject<ImageSource[]>([])

  private static readonly stockImages: string[] = [
    "assets/images/ea1/bird.jpg",
    "assets/images/ea1/kitten.jpg",
    "assets/images/ea1/daisy.jpg",
    "assets/images/ea1/guitar.jpg",
    "assets/images/ea1/guitar-cut-off.jpg",
    "assets/images/ea1/hare.webp",
    "assets/images/ea1/labrador.jpg",
    "assets/images/ea1/mountain-bike.jpg",
    "assets/images/ea1/tiger.jpg",
    "assets/images/ea1/toilet.jpg",
    "assets/images/ea1/tractor.jpeg",
    "assets/images/ea1/pinguine-pair.jpg"
  ]

  constructor(public http: HttpClient) { 
    for (let stockImage of ImageRepositoryService.stockImages) {
      this.loadStockImage(stockImage);
    }
  }

  getAllImagesObservable(): Observable<ImageSource[]> {
    return this.allImages.asObservable();
  }

  getSelectedImageObservable(): Observable<ImageSource> {
    return this.selectedImage.asObservable();
  }

  async setSelected(image: ImageSource) {
    console.warn("hmmmmmaaaa");
    this.selectedImage.next(image);
  }

  async selectFirst() {
    this.selectedImage.next(this.allImages.value[0]);
  }

  addImage(imageSrc: ImageSource) {
    let imageList = this.allImages.value
    if (!imageList.includes(imageSrc)) {
      imageList.splice(0, 0, imageSrc);
      this.allImages.next(imageList);
    }
  }

  private loadStockImage(imageSrcPath: string) {
    this.http.get(imageSrcPath, { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        var base64data = reader.result;                
        this.addImage(base64data);
      }

      reader.readAsDataURL(res); 
    });
  }
}

export type ImageSource = string | ArrayBuffer;