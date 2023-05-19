import { Component,OnInit } from '@angular/core';
import { DepartementService } from '../services/departement.service';
import { Departement } from 'src/app/models/departement';
@Component({
  selector: 'app-list-departement',
  templateUrl: './list-departement.component.html',
  styleUrls: ['./list-departement.component.scss']
})
export class ListDepartementComponent implements OnInit{

  listeDepartement!: Departement[];

  constructor(
  
    private departementService: DepartementService,
  
  ) {}


  ngOnInit() {
  
    this.getListeDepartement();
  }

    getListeDepartement() {
      this.departementService.getDepartements().subscribe({
        next: (reponse: any) => {
          this.listeDepartement = reponse;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
}
