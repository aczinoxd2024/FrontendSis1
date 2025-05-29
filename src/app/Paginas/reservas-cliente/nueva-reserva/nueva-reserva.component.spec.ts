import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaReservaComponent } from './nueva-reserva.component'; // ✅ Corrección de nombre

describe('NuevaReservaComponent', () => {
  let component: NuevaReservaComponent;
  let fixture: ComponentFixture<NuevaReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaReservaComponent] // ✅ Debe coincidir
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
