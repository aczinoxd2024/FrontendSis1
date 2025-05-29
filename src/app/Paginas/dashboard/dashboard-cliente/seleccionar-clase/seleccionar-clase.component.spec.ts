import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarClaseComponent } from './seleccionar-clase.component';

describe('SeleccionarClaseComponent', () => {
  let component: SeleccionarClaseComponent;
  let fixture: ComponentFixture<SeleccionarClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarClaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
