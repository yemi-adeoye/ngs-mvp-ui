import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsPreviewer } from './tags-previewer';

describe('TagsPreviewer', () => {
  let component: TagsPreviewer;
  let fixture: ComponentFixture<TagsPreviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsPreviewer],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsPreviewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
