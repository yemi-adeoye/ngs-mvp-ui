import { Component, EventEmitter, Output, signal, computed, ElementRef, ViewChild, Input } from '@angular/core';
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
  recordingId: string = crypto.randomUUID()

  @Output()
  mediaMode: EventEmitter<MediaMode> = new EventEmitter()

  @Output()
  recordingComplete: EventEmitter<VideoRecording> = new EventEmitter()

  @ViewChild('camera')
  cameraElementRef!: ElementRef<HTMLVideoElement>

  @ViewChild('recordingPreviewer')
  recordingPreviewerElementRef!: ElementRef<HTMLVideoElement>

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

  videoUrl = signal<string>('')

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

      if (this.cameraElementRef) {
        await this.attachCamera(this.cameraElementRef);
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

  ngOnDestroy(): void {
    this.videoService.destroy();
  }

  handleCloseButtonClick() {
    this.mediaMode.emit('picker')
  }

  handleRecordButtonClick() {
    switch (this.controlState()) {
      case IDLE:
      case RECORDED:
      case PLAYED:
        console.log(this.recordingId)
        this.controlState.set(RECORDING)


        this.videoService.startRecording(this.recordingId, (elapsedSeconds) => {
          const remaining = Math.max(0, 60 - elapsedSeconds)
          this.recordingDuration.set(remaining)
        })


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
    this.recordingPreviewerElementRef.nativeElement.muted = this.isMuted()
  }

  handlePlayEnded() {
    this.playbackState.set(PLAYED)
  }

  handleRecordingDone() {
    this.mediaMode.emit(null)
    this.recordingComplete.emit(this.recordedVideo)
  }

  @ViewChild('camera')
  set cameraElement(element: ElementRef<HTMLVideoElement> | undefined) {
    if (element) {
      void this.attachCamera(element);
    }
  }

  private async attachCamera(
    element: ElementRef<HTMLVideoElement>
  ): Promise<void> {
    const stream = this.videoService.mediaStream;

    if (stream) {
      element.nativeElement.srcObject = stream;

      try {
        await element.nativeElement.play();
      } catch (error) {
        console.error('Unable to play camera stream', error);
      }
    }
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

    this.videoUrl.set(recording.url)

    this.videoDuration.set(recording.duration);
    this.recordingDuration.set(recording.duration);

    this.controlState.set(RECORDED);
    this.playbackState.set(IDLE);

    this.recordedVideo = recording
  }
}
