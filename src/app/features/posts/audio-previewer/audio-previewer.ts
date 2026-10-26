import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, computed, signal } from '@angular/core';
import { IDLE, MediaState, PAUSED, PLAYED, PLAYING, RECORDED, RECORDING } from '../../../models/media.state';
import { AudioRecording, AudioService } from '../../../core/services/impl/audio-service';

@Component({
  selector: 'ngs-audio-previewer',
  imports: [],
  templateUrl: './audio-previewer.html',
  styleUrl: './audio-previewer.scss',
  providers: [AudioService]
})
export class AudioPreviewer {
  controlState = signal<MediaState>(IDLE)
  playbackState = signal<MediaState>(IDLE)

  @Input()
  recordingId: string = crypto.randomUUID()

  audioDuration = signal<number>(0)
  audioCurrentTime = signal<number>(0)
  isMuted = signal<boolean>(false)
  playbackPercent = computed(() => {
    if (this.audioDuration() == 0) {
      return 0;
    }
    return Math.round(this.audioCurrentTime() / this.audioDuration() * 100)
  })

  recordingDuration = signal<number>(0)


  @Output()
  delete: EventEmitter<string> = new EventEmitter()

  @Output()
  recordingComplete: EventEmitter<AudioRecording> = new EventEmitter()


  @ViewChild('audioPlayer')
  audioPlayer!: ElementRef<HTMLAudioElement>

  audioUrl: string = ''
  blobChunks: any[] = []

  constructor(private readonly audioService: AudioService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.audioService.initialize()

      this.audioService.recordingComplete$.subscribe({
        next: (recording) => {
          this.recordingEnded(recording)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  ngOnDestroy(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = ''
    }

    this.audioService.destroy();
  }

  handleDelete() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = ''
    }
    this.audioService.destroy()
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

  handleRecordButtonClick() {
    if (this.playbackState() === 'PLAYING') {
      this.audioPlayer.nativeElement.pause()
    }

    switch (this.controlState()) {
      case IDLE:
      case RECORDED:
      case PLAYED:
        console.log(this.recordingId)
        this.audioService.startRecording(this.recordingId, (elapsedSeconds) => {
          const remaining = Math.max(0, 60 - elapsedSeconds)
          this.recordingDuration.set(remaining)
        })

        this.controlState.set(RECORDING)
        this.playbackState.set(IDLE)
        this.recordingDuration.set(0)
        break;

      case RECORDING:
        this.audioService.stopRecording()


        break;

      default:
        throw new Error('Unknowm media state')

    }
  }

  get canPlay() {
    return this.controlState() == RECORDED || this.controlState() == PLAYED
  }

  get canDisable() {
    const { controlState: cs } = this
    return cs() !== 'RECORDED' && cs() !== 'PLAYING' && cs() !== 'PLAYED'
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private recordingEnded(recording: AudioRecording): void {
    this.audioUrl = URL.createObjectURL(recording.blob);

    this.audioDuration.set(recording.duration);
    this.recordingDuration.set(recording.duration);

    this.controlState.set(RECORDED);
    this.playbackState.set(IDLE);

    this.recordingComplete.emit(recording)
  }
}
