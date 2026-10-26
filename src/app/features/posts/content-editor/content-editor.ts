import { Component, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImagePreviewer } from '../image-previewer/image-previewer';
import { AudioPreviewer } from '../audio-previewer/audio-previewer';
import { AudioRecording } from '../../../core/services/impl/audio-service';

interface AudioItem {
  id: string
}

@Component({
  selector: 'ngs-content-editor',
  imports: [ReactiveFormsModule, ImagePreviewer, AudioPreviewer],
  templateUrl: './content-editor.html',
  styleUrl: './content-editor.scss',
})
export class ContentEditor {
  audioRecordings = signal<AudioRecording[]>([])
  audioItems = signal<AudioItem[]>([])
  photoCount = signal<number>(0)
  videoCount = signal<number>(0)

  totalMedia = computed<number>(() => this.audioItems().length + this.photoCount() + this.videoCount())
  MAX_MEDIA_COUNT = 5
  postForm = new FormGroup({
    content: new FormControl(''),
    tags: new FormControl()

  })

  // tags user has selected
  previewTags: { id: number, tag: string }[] = []

  // tags fetched from the backend
  tags: { id: number, tag: string }[] = [
    { id: 1, tag: 'Transfer Gist' },
    { id: 2, tag: 'Team Tactics' },
    { id: 3, tag: 'Underground Law' }
  ]

  addAudioPreviewer = () => {
    if (this.totalMedia() < this.MAX_MEDIA_COUNT) {
      this.audioItems.set([...this.audioItems(), { id: crypto.randomUUID() }])
    }
  }

  handleTagDelete = (tagDeleted: number) => {
    this.previewTags = this.previewTags.filter(tag => tag.id != tagDeleted)
  }

  handleRecordingUpdate(recording: AudioRecording) {
    const without = this.audioRecordings().filter(rec => rec.id != recording.id)
    this.audioRecordings.set([...without, recording])
  }

  handlePostButtonClick() {
    const request = {
      ...this.postForm.getRawValue(),
      tags: this.previewTags.map(tag => tag.id)
    };

    console.log(request);
  }

  handleAudioItemDelete(id: string) {
    const updatedAudioItems = this.audioItems().filter((item) => item.id !== id)
    this.audioItems.set(updatedAudioItems)


    const updatedRecordings = this.audioRecordings().filter((item) => item.id !== id)
    this.audioRecordings.set(updatedRecordings)

    console.log(this.audioRecordings(), this.audioItems())
  }


  populateSelectedTags = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const tagId = Number(select.value)

    // that's the description
    if (tagId == 0) {
      return
    }

    const selectedTag = this.tags.find(tag => tag.id === tagId)

    if (selectedTag && !this.previewTags.some(tag => tag.id === selectedTag.id)) {
      this.previewTags = [...this.previewTags, selectedTag]
    }

    select.value = '0'

  }

  resizeTextArea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    const maxHeight = 180

    textarea.style.height = 'auto'

    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }
}
