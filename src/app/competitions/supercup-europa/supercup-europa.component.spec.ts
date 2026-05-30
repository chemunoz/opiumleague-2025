import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SupercupEuropaComponent } from './supercup-europa.component';

describe('SupercupEuropaComponent', () => {
  let component: SupercupEuropaComponent;
  let fixture: ComponentFixture<SupercupEuropaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupercupEuropaComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SupercupEuropaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
