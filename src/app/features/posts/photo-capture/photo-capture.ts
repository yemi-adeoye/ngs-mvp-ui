import { Component, EventEmitter, Output } from '@angular/core';
import { MediaMode } from '../content-editor/content-editor';

@Component({
  selector: 'ngs-photo-capture',
  imports: [],
  templateUrl: './photo-capture.html',
  styleUrl: './photo-capture.scss',
})
export class PhotoCapture {
  @Output()
  mediaMode: EventEmitter<MediaMode> = new EventEmitter()


  handleCloseButtonClick() {
    this.mediaMode.emit('picker')
  }
}
