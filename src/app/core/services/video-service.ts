import { Service, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { MediaRecording } from '../../models/media';

export interface VideoRecording extends MediaRecording {

}

@Service()
export class VideoService {
  private stream = signal<MediaStream | null>(null)

  private recorder: MediaRecorder | null = null;
  private blobChunks: Blob[] = []
  recordingStartTime = 0

  private recordingCompleteSubject = new Subject<VideoRecording>();
  private currentRecordingId: string | null = null
  recordingComplete$ = this.recordingCompleteSubject.asObservable()

  async inititalize(): Promise<void> {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })

    this.stream.set(stream)

    this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });

    this.recorder.addEventListener("dataavailable", (event: any) => {
      if (event.data.size > 0) {
        this.blobChunks.push(event.data);
      }
    });

    this.recorder.addEventListener('stop', () => {
      // this.clearRecordingTimer();

      const blob = new Blob(this.blobChunks, { type: this.recorder?.mimeType })

      const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000)

      const videoUrl = URL.createObjectURL(blob);

      this.recordingCompleteSubject.next({ id: this.currentRecordingId!, blob, duration, url: videoUrl })
    }
    )

  }

  startRecording(id: string, onTimeUpdate: (elapsedSeconds: number) => void) {
    if (!this.recorder) {
      throw new Error('Audio recorder has not been initialized!')
    }

    this.blobChunks = []

    this.recorder.start()

  }

  stopRecording() {
    if (!this.recorder) {
      throw new Error('Audio recorder has not been initialized!')
    }

    this.recorder.stop()
  }

  get mediaStream() {
    return this.stream()
  }
}
