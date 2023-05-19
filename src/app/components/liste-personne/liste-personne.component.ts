import { Component, OnInit } from '@angular/core';
import {
  ConfirmEventType,
  ConfirmationService,
  FilterMatchMode,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { Departement } from 'src/app/models/departement';
import { Personne } from 'src/app/models/personne';
import { DepartementService } from 'src/app/services/departement.service';
import { PersonneService } from 'src/app/services/personne.service';


@Component({
  selector: 'app-liste-personne',
  templateUrl: './liste-personne.component.html',
  styleUrls: ['./liste-personne.component.scss'],
  providers: [MessageService],
})
export class ListePersonneComponent implements OnInit {
  visible !: boolean;
  submitted !: boolean;

  btnText !: any;

  personne !: Personne;
  listePersonne !: Personne[];

  ListeDepartement!: Departement[];

  constructor(
    private _personneService: PersonneService,
    private _messageService: MessageService,
    private departementService: DepartementService,
    private _confirmationService: ConfirmationService,
    private _config : PrimeNGConfig
  ) {}

  ngOnInit() {
    this.getListePersonne();
    this.getListeDepartement();
    this._config.filterMatchModeOptions = {
      text: [],
      numeric: [
        FilterMatchMode.LESS_THAN,
        FilterMatchMode.GREATER_THAN,
      ],
      date: []
    }
  }

  // Cette fonction permet d'afficher le formulaire de saisie de personne
  showDialog() {
    this.visible = true;
    this.submitted = false;
    this.personne = {};
    this.btnText = 'Ajouter';
  }

  // Cette fonction permet de récupérer la liste des departements depuis le service
  getListeDepartement() {
    this.departementService.getDepartements().subscribe({
      next: (reponse: any) => {
        this.ListeDepartement = reponse;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  // Cette fonction permet de récupérer la liste des personnes depuis le service
  getListePersonne() {
    this._personneService.getPersonnes().subscribe({
      next: (reponse) => {
        this.listePersonne = reponse;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Cette fonction permet de pré-remplir le formulaire avec les données d'une personne existante pour la modifier
  editPersonne(personne: Personne) {
    this.personne = { ...personne };
    this.visible = true;
    this.btnText = 'Modifier';
  }

  // Cette fonction permet de supprimer une personne de la liste
 // Cette fonction permet de supprimer une personne en utilisant l'identifiant passé en paramètre

deletePersonne(id: number) {
  // On ouvre une boîte de confirmation pour demander à l'utilisateur s'il est sûr de supprimer la personne sélectionnée
  this._confirmationService.confirm({
    message: 'Etes vous sûr de supprimer la personne selectionnée ?', // Le message à afficher dans la boîte de confirmation
    header: 'Confirmer', // Le titre de la boîte de confirmation
    icon: 'pi pi-exclamation-triangle', // L'icône à afficher dans la boîte de confirmation
    accept: () => { // Si l'utilisateur accepte la confirmation
      // On appelle le service pour supprimer la personne avec l'identifiant passé en paramètre
      this._personneService.deletePersonne(id).subscribe({
        complete: () => { // Si la suppression est complétée avec succès
          // On recharge la liste des personnes pour mettre à jour l'affichage
          this.getListePersonne();
          // On affiche un message de succès avec l'objet MessageService
          this._messageService.add({
            severity: 'error',
            summary: 'success',
            detail: 'personne supprimée.',
            life: 5000, // La durée pendant laquelle le message doit être affiché (en millisecondes)
          });
        },
        error: (error: any) => { // Si une erreur se produit pendant la suppression
          console.log(error); // On affiche l'erreur dans la console
        },
      });
    },
    reject: (type: any) => { // Si l'utilisateur rejette la confirmation ou annule l'action
      switch (type) {
        case ConfirmEventType.REJECT: // Si l'utilisateur rejette la confirmation
          // On affiche un message d'erreur avec l'objet MessageService
          this._messageService.add({
            severity: 'error',
            summary: 'Rejet',
            detail: 'vous avez rejecté la suppression',
          });
          break;
        case ConfirmEventType.CANCEL: // Si l'utilisateur annule l'action
          // On affiche un message d'avertissement avec l'objet MessageService
          this._messageService.add({
            severity: 'warn',
            summary: 'Annulation',
            detail: 'vous avez annulé la suppression',
          });
          break;
      }
    },
  });
}

  // Cette fonction permet d'ajouter ou de modifier une personne
 // Cette fonction permet de sauvegarder une personne, en ajoutant une nouvelle personne si l'identifiant est null,
// ou en mettant à jour une personne existante si l'identifiant est fourni

savePersonne(id: any, personne: Personne) {
  this.submitted = true; // On indique que le formulaire a été soumis

  // Vérification des champs du formulaire
  if (!personne.nom || !personne.prenoms || !personne.age || !personne.departement) {
    // Si un champ est manquant, on affiche un message d'erreur avec l'objet MessageService et on quitte la fonction
    this._messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Veuillez remplir tous les champs.',
      life: 5000, // La durée pendant laquelle le message doit être affiché (en millisecondes)
    });
    return;
  }

  if (this.btnText === 'Ajouter') { // Si on est en train d'ajouter une nouvelle personne
    // On appelle le service pour créer la nouvelle personne
    this._personneService.createPersonne(personne).subscribe({
      complete: () => { // Si la création est complétée avec succès
        // On recharge la liste des personnes pour mettre à jour l'affichage
        this.getListePersonne();
        // On affiche un message de succès avec l'objet MessageService
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Personne Ajoutée',
          life: 5000, // La durée pendant laquelle le message doit être affiché (en millisecondes)
        });
      },
      error: (error: any) => { // Si une erreur se produit pendant la création
        console.log(error); // On affiche l'erreur dans la console
      },
    });
  } else { // Si on est en train de modifier une personne existante
    const index = this.listePersonne.findIndex((p) => p.id === id); // On récupère l'index de la personne dans la liste
    // On appelle le service pour mettre à jour la personne avec l'identifiant et les données fournies
    this._personneService.updatePersonne(id, personne).subscribe({
      complete: () => { // Si la mise à jour est complétée avec succès
        this.listePersonne[index] = personne; // On met à jour la personne dans la liste locale
        // On affiche un message de succès avec l'objet MessageService
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Personne modifiée',
          life: 5000, // La durée pendant laquelle le message doit être affiché (en millisecondes)
        });
      },
      error: (error: any) => { // Si une erreur se produit pendant la mise à jour
        console.log(error); // On affiche l'erreur dans la console
      },
    });
  }

  this.visible = false; // On masque la fenêtre modale
}
}
