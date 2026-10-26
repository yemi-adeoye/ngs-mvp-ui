import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPreviewer } from './audio-previewer';

describe('AudioPreviewer', () => {
  let component: AudioPreviewer;
  let fixture: ComponentFixture<AudioPreviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioPreviewer],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioPreviewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
