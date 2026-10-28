import { Component, EventEmitter, Output } from '@angular/core';
import { MediaMode } from '../content-editor/content-editor';

@Component({
  selector: 'ngs-media-picker',
  imports: [],
  templateUrl: './media-picker.html',
  styleUrl: './media-picker.scss',
})
export class MediaPicker {


  @Output()
  mediaMode: EventEmitter<MediaMode> = new EventEmitter()

  @Output()
  fileSelected = new EventEmitter<void>();

  handleCloseButtonClick() {
    this.mediaMode.emit(null)
  }

  handlePhotoButtonClick() {
    this.mediaMode.emit('photo')
  }

  handleVideoButtonClick() {
    this.mediaMode.emit('video')
  }

  handleFileButtonClick() {
    this.fileSelected.emit()
  }

  handleAudioButtonClick() {
    this.mediaMode.emit('audio')
  }
}
