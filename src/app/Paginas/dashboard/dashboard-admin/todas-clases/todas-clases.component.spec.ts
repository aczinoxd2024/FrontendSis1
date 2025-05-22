import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodasClasesComponent } from './todas-clases.component';

describe('TodasClasesComponent', () => {
  let component: TodasClasesComponent;
  let fixture: ComponentFixture<TodasClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodasClasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodasClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
