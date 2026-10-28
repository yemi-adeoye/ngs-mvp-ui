import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCapture } from './video-capture';

describe('VideoCapture', () => {
  let component: VideoCapture;
  let fixture: ComponentFixture<VideoCapture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCapture],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCapture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
