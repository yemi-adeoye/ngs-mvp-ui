import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, computed, signal } from '@angular/core';
import { AudioRecording } from '../../../core/services/impl/audio-service';
import { IDLE, MediaState, PAUSED, PLAYED, PLAYING } from '../../../models/media.state';

@Component({
  selector: 'ngs-audio-previewer',
  imports: [],
  templateUrl: './audio-previewer.html',
  styleUrl: './audio-previewer.scss',
  providers: []
})
export class AudioPreviewer {

  @Input()
  recordingId: string = crypto.randomUUID()

  @Input()
  audioDuration: number = 0;

  @Input()
  audioUrl: string = ''

  @Output()
  delete: EventEmitter<string> = new EventEmitter()

  @Output()
  recordingComplete: EventEmitter<AudioRecording> = new EventEmitter()

  @ViewChild('audioPlayer')
  audioPlayer!: ElementRef<HTMLAudioElement>

  playbackState = signal<MediaState>(IDLE)

  audioCurrentTime = signal<number>(0)
  isMuted = signal<boolean>(false)
  playbackPercent = computed(() => {
    if (this.audioDuration == 0) {
      return 0;
    }
    return Math.round(this.audioCurrentTime() / this.audioDuration * 100)
  })

  ngOnDestroy(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = ''
    }

  }

  handleDelete() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = ''
    }
    this.delete.emit(this.recordingId)
  }

  handlePlayEnded() {
    this.playbackState.set(PLAYED)
  }

  handleMute() {
    this.isMuted.set(!this.isMuted())
    this.audioPlayer.nativeElement.muted = this.isMuted()
  }

  handleAudioPlayerTimeUpdate() {
    this.audioCurrentTime.set(Math.floor(this.audioPlayer.nativeElement.currentTime))
  }

  handlePlayback() {
    switch (this.playbackState()) {
      case PLAYING:
        this.playbackState.set(PAUSED)
        this.audioPlayer.nativeElement.pause()
        break;
      case PLAYED:
        this.playbackState.set(PLAYING)
        this.audioPlayer.nativeElement.play()
        break;
      case PAUSED:
        this.playbackState.set(PLAYING)
        this.audioPlayer.nativeElement.play()
        break;
      case IDLE:
        this.audioPlayer.nativeElement.play()
        this.playbackState.set(PLAYING)
        break;
      default:
        throw new Error('Unknow playback state')
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }


}
