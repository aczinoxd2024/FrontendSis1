import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaReservasComponent } from './agenda-reservas.component';

describe('AgendaReservasComponent', () => {
  let component: AgendaReservasComponent;
  let fixture: ComponentFixture<AgendaReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaReservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
