import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ImageRepositoryService, ImageSource } from 'src/app/ea1/services/image-repository/image-repository.service';


@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  isDropZoneActive: Boolean = false

  validFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ]

  selectedImage: ImageSource = null

  constructor(private imageRepo: ImageRepositoryService, private toastController: ToastController) { 
  }

  ngOnInit() {
    this.imageRepo.getSelectedImageObservable().subscribe(selectedImage => {
      this.selectedImage = selectedImage;
    });
  }

  onPresentFilePicker() {
    this.fileInput.nativeElement.click();
  }

  onFilesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.handleDrop(target.files);
  }

  handleDrop(fileList: FileList) {
    for (var i=0; i<fileList.length; i++) {
      let file = fileList[i];
      if (this.validFileTypes.includes(file.type)) {
        this.readFile(file,  i+1 == fileList.length);
      } else {
        this.presentToastWithOptions()
      }
    }
  }

  private readFile(file: File, willSelect: Boolean = false) {
    let fileReader = new FileReader()
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      this.imageRepo.addImage(fileURL);
      if (willSelect) {
        setTimeout(() => {
          this.imageRepo.selectFirst();
        }, 10);
      }
    };
    fileReader.readAsDataURL(file);
  }

  dropZoneState(isActive: Boolean) {
    this.isDropZoneActive = isActive
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Wrong file format',
      message: 'Only JPEG, PNG and WEBP image files are supported at the moment.',
      position: 'top',
      color: "danger",
      duration: 2000,
      animated: true,
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
