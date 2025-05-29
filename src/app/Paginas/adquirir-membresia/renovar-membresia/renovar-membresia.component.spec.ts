import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovarMembresiaComponent } from './renovar-membresia.component';

describe('RenovarMembresiaComponent', () => {
  let component: RenovarMembresiaComponent;
  let fixture: ComponentFixture<RenovarMembresiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenovarMembresiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovarMembresiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
