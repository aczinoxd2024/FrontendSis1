import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarRutinasInstructorComponent } from './gestionar-rutinas-instructor.component';

describe('gestionar-rutinas-instructorComponent', () => {
  let component: GestionarRutinasInstructorComponent;
  let fixture: ComponentFixture<GestionarRutinasInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarRutinasInstructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarRutinasInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
