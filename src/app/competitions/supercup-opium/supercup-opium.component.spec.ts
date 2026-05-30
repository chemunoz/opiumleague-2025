import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SupercupOpiumComponent } from './supercup-opium.component';

describe('SupercupOpiumComponent', () => {
  let component: SupercupOpiumComponent;
  let fixture: ComponentFixture<SupercupOpiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupercupOpiumComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SupercupOpiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
