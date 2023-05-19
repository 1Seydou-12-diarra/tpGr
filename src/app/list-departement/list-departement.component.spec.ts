import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Departement } from '../models/departement';
import { ListDepartementComponent } from './list-departement.component';
import { HttpClientModule } from '@angular/common/http';
import { DepartementService } from '../services/departement.service';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('ListDepartementComponent', () => {
  let component: ListDepartementComponent;
  let fixture: ComponentFixture<ListDepartementComponent>;
  
  // Création de spyObj pour les services
  const departementServiceStub = jasmine.createSpyObj('DepartementService', ['getDepartements']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],

      declarations: [ListDepartementComponent],

      providers: [
        {provide : DepartementService, useValue: departementServiceStub}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture= TestBed.createComponent(ListDepartementComponent);
    component = fixture.componentInstance;

    departementServiceStub.getDepartements.and.returnValue(of([]));

    fixture.detectChanges();
  })

 // Test unitaire pour vérifier si le composant est créé avec succès
  it('should creaye', () => {
    expect(component).toBeTruthy;
    
  })

  fit('should tester getListeDepartement',() => {
    // GIVEN
    // Création d'un tableau simulé de départements
    const departement = new Departement(1,'ABJ',"Abidjan");

    // Configuration du comportement simulé du service
    departementServiceStub.getDepartements.and.returnValue(of([departement]));

    // Espionner la méthode getListeDepartement du composant
    //spyOn(component,'getListeDepartement');

    // WHEN
    component.getListeDepartement();

    // THEN
    // Vérifier si la méthode getListeDepartement est appelée et renvoie les données simulées
    expect(component.listeDepartement).toEqual([departement]);
  });
});
