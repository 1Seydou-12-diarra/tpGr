import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePersonneComponent } from './liste-personne.component';
import {PersonneService} from "../../services/personne.service";
import {DepartementService} from "../../services/departement.service";
import {ConfirmationService, MessageService} from "primeng/api";
import { HttpClientModule} from "@angular/common/http";
import {ConfirmDialog, ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {TreeModule} from "primeng/tree";
import {TreeTableModule} from "primeng/treetable";
import {ToolbarModule} from "primeng/toolbar";
import {of} from "rxjs";
import {Departement} from "../../models/departement";
import {Personne} from "../../models/personne";
import { NO_ERRORS_SCHEMA } from '@angular/compiler';


describe('ListePersonneComponent', () => {
  let component: ListePersonneComponent;
  let fixture: ComponentFixture<ListePersonneComponent>;

  // Création de spyObj pour les services
  const personneServiceStub = jasmine.createSpyObj('PersonneService', ['getPersonnes','createPersonne','updatePersonne','deletePersonne']);
  const confirmationServiceStub = jasmine.createSpyObj('ConfirmationService', ['confirm']);
  const messageServiceStub = jasmine.createSpyObj('MessageService', ['add']);
  const departementServiceStub = jasmine.createSpyObj('DepartementService',['getDepartements'])
  const confirmDialogSpy = jasmine.createSpyObj('ConfirmDialog', ['accept', 'reject']);

  beforeEach( () => {
  TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfirmDialogModule,
        DialogModule,
        ToastModule,
        TableModule,
        TreeModule,
        TreeTableModule,
        ToolbarModule
      ],
      declarations: [ListePersonneComponent],
     
      providers: [
        //  Fournir les spyObj en tant que valeurs des services
        {provide: PersonneService, useValue: personneServiceStub},
         {provide : MessageService, useValue: messageServiceStub},
       {provide : DepartementService, useValue: departementServiceStub},
         {provide : ConfirmationService, useValue: confirmationServiceStub},
         {provide: ConfirmDialog, useValue: confirmDialogSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }) .compileComponents();
    // fixture = TestBed.createComponent(ListePersonneComponent);
    // component = fixture.componentInstance;
    
    
    // fixture.detectChanges();
  });
  beforeEach(()=>{

    fixture =TestBed.createComponent(ListePersonneComponent);
    component = fixture.componentInstance;

     personneServiceStub.getPersonnes.and.returnValue(of([]));

     fixture.detectChanges();

  })
  it('should create', ()=> {
    expect(component).toBeTruthy;
  })
  it('should set listePersonne property with the response from PersonneService', () => {
    // GIVEN
    const departement = new Departement(1,'ABJ',"Abidjan")
    const personne = [new Personne(1,"Diarra","Seydou",22,departement), new Personne(2,"Bamba","Wingnemila",24,departement)];

    // Mocking: configurer la méthode getPersonnes pour renvoyer la valeur Mpersonne
    personneServiceStub.getPersonnes.and.returnValue(of([personne]));

    // WHEN
    component.getListePersonne();

    // THEN
    expect(component.listePersonne).toEqual(personne);
  });
});
