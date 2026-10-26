import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviewer } from './image-previewer';

describe('ImagePreviewer', () => {
  let component: ImagePreviewer;
  let fixture: ComponentFixture<ImagePreviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePreviewer],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePreviewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
