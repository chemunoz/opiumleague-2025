import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UefaComponent } from './uefa.component';

describe('UefaComponent', () => {
  let component: UefaComponent;
  let fixture: ComponentFixture<UefaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UefaComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
