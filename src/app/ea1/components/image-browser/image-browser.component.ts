import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { ImageRepositoryService, ImageSource } from 'src/app/ea1/services/image-repository/image-repository.service';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
})
export class ImageBrowserComponent implements OnInit {

  @ViewChild('list') listView: ElementRef;

  list: IonList
  selectedImage: ImageSource = null
  allImages: ImageSource[] = []
  
  repoImages: ImageSource[] = []

  constructor(private imageRepo: ImageRepositoryService) {
  }

  ngOnInit() {
    this.imageRepo.getAllImagesObservable().subscribe(allImages => {
      this.allImages = allImages;
      if (this.listView != null) {
        this.listView.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
    }
    });

    this.imageRepo.getSelectedImageObservable().subscribe(selectedImage => {
      this.selectedImage = selectedImage;
    });
  }

  onSelectImage(image: ImageSource) {
    this.selectedImage = image;
    this.imageRepo.setSelected(image);
  }

}
