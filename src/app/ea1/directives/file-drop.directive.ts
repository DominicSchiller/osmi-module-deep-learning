import { Directive, EventEmitter, HostListener, Output } from '@angular/core';


@Directive({
  selector: '[fileDrop]'
})
export class FileDropDirective {

  @Output() filesDropped = new EventEmitter<FileList>();
  @Output() filesHovered = new EventEmitter<Boolean>();

  constructor() { }

  // Interaction Events
  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault();
    this.filesHovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: DragEvent) {
    $event.preventDefault();
    this.filesHovered.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault()
    let transfer = $event.dataTransfer;
    let files = transfer.files;
    this.filesDropped.emit(files);
    this.filesHovered.emit(false);
  }

}
