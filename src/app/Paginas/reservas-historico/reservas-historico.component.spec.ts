import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasHistoricoComponent } from './reservas-historico.component';

describe('ReservasHistoricoComponent', () => {
  let component: ReservasHistoricoComponent;
  let fixture: ComponentFixture<ReservasHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
