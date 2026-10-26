import { Service } from '@angular/core';
import { Subject } from 'rxjs';

export interface AudioRecording {
  blob: Blob,
  duration: number
  id: string
}

@Service()
export class AudioService {
  private recorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null
  private blobChunks: Blob[] = []
  recordingTimer: ReturnType<typeof setInterval> | null = null;
  recordingStartTime = 0
  private readonly MAX_RECORDING_TIME = 60_000;
  private recordingCompleteSubject = new Subject<AudioRecording>();
  private currentRecordingId: string | null = null
  recordingComplete$ = this.recordingCompleteSubject.asObservable()

  async initialize(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    this.recorder = new MediaRecorder(this.stream, { mimeType: "audio/webm;codecs=opus" });


    this.recorder.addEventListener("dataavailable", (event: any) => {
      if (event.data.size > 0) {
        this.blobChunks.push(event.data);
      }
    });

    this.recorder.addEventListener('stop', () => {
      this.clearRecordingTimer();

      const blob = new Blob(this.blobChunks, { type: this.recorder?.mimeType })

      const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000)

      this.recordingCompleteSubject.next({ id: this.currentRecordingId!, blob, duration })
    }
    )
  }

  startRecording(id: string, onTimeUpdate: (elapsedSeconds: number) => void): void {
    if (!this.recorder) {
      throw new Error('Audio recorder has not been initialized!')
    }

    this.currentRecordingId = id

    this.blobChunks = []
    this.recordingStartTime = Date.now()

    this.recorder.start()

    this.recordingTimer = setInterval(() => {
      const elaspedSeconds = Math.floor((Date.now() - this.recordingStartTime) / 1000)
      onTimeUpdate(elaspedSeconds)
      this.enforceMaxRecordingTime()
    }, 250)
  }

  stopRecording(): void {
    if (!this.recorder) {
      throw new Error('Audio recorder has not been initialized!')
    }

    this.recorder.stop()
  }

  private enforceMaxRecordingTime(): void {
    if (Date.now() - this.recordingStartTime >= this.MAX_RECORDING_TIME) {
      this.recorder?.stop()
    }
  }

  private clearRecordingTimer(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer)
      this.recordingTimer = null
    }
  }

  destroy(): void {
    this.clearRecordingTimer();
    this.stream?.getTracks().forEach(track => track.stop())
    this.stream = null
    this.recorder = null
    this.blobChunks = []
  }
}
