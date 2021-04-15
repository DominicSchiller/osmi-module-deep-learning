import { Component, OnInit } from '@angular/core';
import { ImageRepositoryService, ImageSource } from '../../services/image-repository/image-repository.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {

  private selectedImage: ImageSource = null

  constructor(private imageRepo: ImageRepositoryService) {

    imageRepo.getSelectedImageObservable().subscribe(image => {
      this.selectedImage = image;
    });

   }

  ngOnInit() {}

}
