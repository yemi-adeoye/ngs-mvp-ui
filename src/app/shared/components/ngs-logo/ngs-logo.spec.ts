import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgsLogo } from './ngs-logo';

describe('NgsLogo', () => {
  let component: NgsLogo;
  let fixture: ComponentFixture<NgsLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgsLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(NgsLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
