export const IDLE = 'IDLE'
export const RECORDING = 'RECORDING'
export const PLAYING = 'PLAYING'
export const PLAYED = 'PLAYED'
export const RECORDED = 'RECORDED'
export const PAUSED = 'PAUSED'



export const MEDIA_STATE = {
  IDLE, RECORDING, PLAYING, PLAYED, RECORDED, PAUSED
}
export type MediaState = (typeof MEDIA_STATE)[keyof typeof MEDIA_STATE]

