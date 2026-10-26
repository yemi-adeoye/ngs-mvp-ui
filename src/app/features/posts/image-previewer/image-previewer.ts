import { Component } from '@angular/core';

@Component({
  selector: 'ngs-image-previewer',
  imports: [],
  templateUrl: './image-previewer.html',
  styleUrl: './image-previewer.scss',
})
export class ImagePreviewer {
  handleDelete() {
    console.log('Deleted!')
  }
}
