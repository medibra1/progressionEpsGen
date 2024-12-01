import { Injectable } from '@angular/core';

export interface IHeaderData {
  title: string;
  schoolName: string;
  professor: string;
  class: string;
  region :string;
  year_year?: string;
  color?: string;
}
export interface ITableData {
  period: string;
  sessions: number;
  hours: number;
  competence: string;
  lesson: string;
  activity: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressionEpsService {

  competences1 = [
    "1. L'apprenant traite une situation liée au développement de ses possibilités psychomotrices et organiques en produisant différentes allures en fonction la durée de l’effort et/ou de la distance à parcourir.",
    "2. L'apprenant traite une situation de coordination motrice, de rythme et d'esthétique en réalisant des enchainements d'actions variés.",
    "3. L'apprenant traite une situation de coordination motrice, de rythme, de force et de maitrise de soi en réalisant des enchainements d'actions variés et adaptés à l'évolution du rapport de force dans une activité de duel.",
    "4. L'apprenant exécute des enchaînements d'actions pour développer sa coordination motrice, sa détente, sa force de projection et cultiver en soi le goût de l'effort et le sens de la responsabilité.",
    "5. L'apprenant traite une situation d'intégration à un groupe par la planification avec ses pairs des stratégies de coopération, par le respect des règles et l'exécution de différents rôles.",
    "Révision"
  ];

  lessons1 = [
    "1. Fournir un effort de longue durée pour développer les structures cardio-respiratoires.",
    "2. Fournir un effort de courte durée pour développer les structures neuromusculaires et le temps de réaction.",
    "3. Produire des enchaînements d'actions motrices variées dans leur forme et dans leur rythme.",
    "4. Exécuter des techniques de projections et de contrôle pour développer la coordination motrice et la souplesse.",
    "5. Exécuter des sauts pour développer la détente.",
    "6. Exécuter des lancers pour développer la force de projection.",
    "7. Jouer un rôle dans la pratique d'un sport collectif de petit terrain pour développer son esprit d'équipe et le sens de la responsabilité.",
    "8. Jouer un rôle dans la pratique d'un sport collectif de grand terrain pour développer son esprit d'équipe et le sens de la responsabilité.",
    "Révision"
  ]

  competences2 = [
    "1. L'apprenant traite une situation liée au renforcement de ses possibilités psychomotrices et organiques en produisant différentes allures en fonction de la durée et/ou de la distance à parcourir.",
    "2. L'apprenant traite une situation de coordination motrice, de rythme et d'esthétique en réalisant des enchaînements d'actions variés et cohérents.",
    "3. L'apprenant traite une situation de coordination motrice, de rythme, de force et de maitrise de soi en réalisant des enchaînements d'actions variés et adaptés à l'évolution du rapport de force dans une activité de duel.",
    "4. L'apprenant exécute des enchaînements d'actions pour renforcer sa coordination motrice, sa détente, sa force de projection et cultiver en lui le goût de l'effort et le sens de la responsabilité.",
    "5. L'apprenant traite une situation d'intégration à un groupe par la planification avec ses pairs des stratégies de coopération, par le respect des règles et par l'exécution de différents rôles.",
    "Révision"
    ];

  lessons2 = [
    "1. Fournir un effort de longue durée pour renforcer ses potentialités cardio-respiratoires.",
    "2. Fournir un effort de moyenne durée pour renforcer ses potentialités neuromusculaires et cardio-respiratoires.",
    "3. Fournir un effort de courte durée pour renforcer sa capacité de réaction.",
    "4. Produire des enchaînements d'actions variés, cohérents pour renforcer sa coordination motrice et l'amplitude de ses mouvements.",
    "5. Exécuter des techniques de projections et de contrôles pour renforcer sa coordination motrice et sa souplesse.",
    "6. Réaliser des sauts pour renforcer ses capacités de détente.",
    "7. Exécuter des projetions d'engin le plus loin possible pour renforcer sa force et sa vitesse d'exécution.",
    "8. Jouer un rôle dans la pratique d'un sport collectif de petit terrain pour renforcer en soi-même le sentiment d'appartenir à un groupe, le sens de la responsabilité et l'esprit de tolérance.",
    "9: Jouer un rôle dans la pratique d'un sport collectif de grand terrain pour renforcer en soi-méme le sentiment d'appartenir à un groupe, le sens de la responsabilité et l'esprit de tolérance.",
    "Révision"
  ];
  activities = [
    "La course d’endurance",
    "La gymnastique",
    "Le saut en longueur",
    "Le saut en hauteur",
    "Le handball",
    "Le volleyball",
    "Le football",
    "Le basketall",
    "La course de vitesse",
    "Le lancer de poids",
    "Révision"
  ];

  currentYear = new Date().getFullYear();
  schoolYear = `${this.currentYear}-${this.currentYear + 1}`;

  private readonly headerKey = 'progressEpsHeader';
  private readonly tableKey = 'progressEpsTable';

  defaultHeader: IHeaderData = {
    title: 'Progression annuelle EPS '+this.schoolYear, 
    schoolName: 'Collège Moderne Bessio De Lambert',
    region: 'Dabou',
    class: '4ème 2',
    professor: 'Mme CISSE',
    year_year: this.schoolYear
  };

  defaultTableData: ITableData[] = [
    { period: '23/09/24 au 29/10/24', sessions: 5, hours: 10, competence: this.competences1[0], lesson: this.lessons1[1], activity: this.activities[0] },
    { period: '04/11/24 au 29/10/24', sessions: 7, hours: 14, competence: this.competences1[3], lesson: this.lessons1[1], activity: this.activities[3] },
    { period: '06/01/25 au 28/02/25', sessions: 5, hours: 10, competence: this.competences1[1], lesson: this.lessons1[0], activity: this.activities[1] },
    { period: '03/03/25 au 16/04/25', sessions: 6, hours: 12, competence: this.competences1[4], lesson: this.lessons1[4], activity: this.activities[2] },
    { period: '24/04/25 au 23/05/25', sessions: 6, hours: 12, competence: this.competences1[4], lesson: this.lessons1[2], activity: this.activities[4] }
  ];

  constructor() { }

  getHeaderData(): IHeaderData {
    const savedData = localStorage.getItem(this.headerKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return this.defaultHeader;
  }
  getTableData(): ITableData[] {
    const savedData = localStorage.getItem(this.tableKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return this.defaultTableData;
  }

  saveData(headerdata: IHeaderData, tableData: ITableData[] ): void {
    // const jsonData = JSON.stringify(data);
    if(headerdata) localStorage.setItem(this.headerKey, JSON.stringify(headerdata));
    if(tableData) localStorage.setItem(this.tableKey, JSON.stringify(tableData));
  }

  async clearData() {
    try {
      localStorage.removeItem(this.headerKey);
      localStorage.removeItem(this.tableKey);
    } catch (error) {
      console.log(error);
    }
  }

}
