import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditor } from './content-editor';

describe('ContentEditor', () => {
  let component: ContentEditor;
  let fixture: ComponentFixture<ContentEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
