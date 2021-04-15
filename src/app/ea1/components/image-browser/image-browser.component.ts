import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ImageRepositoryService, ImageSource } from 'src/app/ea1/services/image-repository/image-repository.service';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
})
export class ImageBrowserComponent implements OnInit {

  selectedImage: ImageSource = null
  allImages: ImageSource[] = []
  
  repoImages: ImageSource[] = []

  constructor(private imageRepo: ImageRepositoryService) {
  }

  ngOnInit() {
    this.imageRepo.getAllImagesObservable().subscribe(allImages => {
      this.allImages = allImages;
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
