import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCapture } from './audio-capture';

describe('AudioCapture', () => {
  let component: AudioCapture;
  let fixture: ComponentFixture<AudioCapture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioCapture],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioCapture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
