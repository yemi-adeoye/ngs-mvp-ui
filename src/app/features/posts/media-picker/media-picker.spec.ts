import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPicker } from './media-picker';

describe('MediaPicker', () => {
  let component: MediaPicker;
  let fixture: ComponentFixture<MediaPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
