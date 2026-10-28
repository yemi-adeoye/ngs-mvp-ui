import { Component, EventEmitter, Output, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { MediaMode } from '../content-editor/content-editor';
import { IDLE, MediaState, PLAYED, RECORDED, RECORDING } from '../../../models/media.state';
import { VideoRecording, VideoService } from '../../../core/services/video-service';

@Component({
  selector: 'ngs-video-capture',
  imports: [],
  templateUrl: './video-capture.html',
  styleUrl: './video-capture.scss',
  providers: [VideoService]
})
export class VideoCapture {
  @Output()
  mediaMode: EventEmitter<MediaMode> = new EventEmitter()

  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>

  recordingDuration = signal<number>(0)
  videoDuration = signal<number>(0)
  videoCurrentTime = signal<number>(0)
  playbackPercent = computed(() => {
    if (this.videoDuration() == 0) {
      return 0;
    }
    return Math.round(this.videoCurrentTime() / this.videoDuration() * 100)
  })

  controlState = signal<MediaState>(IDLE)
  playbackState = signal<MediaState>(IDLE)
  isMuted = signal<boolean>(false)

  videoUrl: string = ''

  recordedVideo: VideoRecording = {
    blob: null,
    duration: 0,
    id: '',
    url: ''
  }

  constructor(private readonly videoService: VideoService) { }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.videoService.inititalize()
      const stream = this.videoService.mediaStream

      if (stream) {
        this.videoPlayer.nativeElement.srcObject = stream
        await this.videoPlayer.nativeElement.play()
      }

      this.videoService.recordingComplete$.subscribe({
        next: (recording) => {
          this.recordingEnded(recording)
        }
      })
    } catch (error) {
      console.error(error)
    }

  }

  handleCloseButtonClick() {
    this.mediaMode.emit('picker')
  }

  handleRecordButtonClick() {
    switch (this.controlState()) {
      case IDLE:
      case RECORDED:
      case PLAYED:
        this.videoService.startRecording('this.recordingId', (elapsedSeconds) => {
          const remaining = Math.max(0, 60 - elapsedSeconds)
          this.recordingDuration.set(remaining)
        })

        this.controlState.set(RECORDING)
        this.playbackState.set(IDLE)
        this.recordingDuration.set(0)
        break;

      case RECORDING:
        this.videoService.stopRecording()


        break;

      default:
        throw new Error('Unknowm media state')

    }
  }

  handlePlayback() {

  }

  handleMute() {
    this.isMuted.set(!this.isMuted())
    this.videoPlayer.nativeElement.muted = this.isMuted()
  }

  handlePlayEnded() {
    this.playbackState.set(PLAYED)
  }

  handleRecordingDone() {

  }



  get canDisablePlayback() {
    const { controlState: cs } = this
    return cs() !== 'RECORDED' && cs() !== 'PLAYING' && cs() !== 'PLAYED'
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private recordingEnded(recording: VideoRecording): void {
    if (recording.blob == null) {
      console.error('Nothing was recorded')
      return
    }

    this.videoUrl = recording.url

    this.videoDuration.set(recording.duration);
    this.recordingDuration.set(recording.duration);

    this.controlState.set(RECORDED);
    this.playbackState.set(IDLE);

    this.recordedVideo = recording
  }
}
