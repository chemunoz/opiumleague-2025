import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupercupSpainComponent } from './supercup-spain.component';

describe('SupercupSpainComponent', () => {
  let component: SupercupSpainComponent;
  let fixture: ComponentFixture<SupercupSpainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupercupSpainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupercupSpainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
