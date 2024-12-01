import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './components/modal/modal.component';
import { IHeaderData, ITableData, ProgressionEpsService } from './services/progression-eps/progression-eps.service';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface TableData {
  period: string;
  sessions: number;
  hours: number;
  competence: string;
  lesson: string;
  activity: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  // colors: string[] = ['#d9edf7', '#dff0d8'];

  displayModal = false;
  displayTableContentModal = false;

  selectedHeaderColor: string = '#F56666';

  progressionService = inject(ProgressionEpsService);

  // headerData: IHeaderData;
  // tableData: ITableData[];
  competences;
  lessons;
  activities;
  selectedSkillLesson: string = '1';

  colors: string[] = ['#d9edf7', '#dff0d8'];

  headerForm: FormGroup;
  tableForm: FormGroup;
  formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.competences = this.progressionService.competences1;
    this.lessons =  this.progressionService.lessons1;
    this.activities =  this.progressionService.activities;

    // this.headerData = this.progressionService.getHeaderData();
    this.initializeHeaderForm(this.progressionService.getHeaderData());
    this.initializeTableForm(this.progressionService.getTableData());
    // this.tableData = this.progressionService.getTableData();
  }

  get f() {
    return this.headerForm.controls;
  }

  initializeHeaderForm(headerData: IHeaderData): void {
    this.headerForm = this.formBuilder.group({
      title: headerData.title,
      schoolName: headerData.schoolName,
      professor: headerData.professor,
      class: headerData.class,
      region : headerData.region,
      year_year : headerData.year_year,
      color: headerData.color
    });
  }

  initializeTableForm(tableData: ITableData[]): void {
    const rows = tableData.map(data =>
      this.formBuilder.group({
        period: [data.period],
        sessions: [data.sessions],
        hours: [data.hours],
        competence: [data.competence],
        lesson: [data.lesson],
        activity: [data.activity]
      })
    );

    this.tableForm = this.formBuilder.group({
      rows: this.formBuilder.array(rows)
    });
  }

  get rows(): FormArray {
    return this.tableForm.get('rows') as FormArray;
  }

  saveEpsProgressionData(): void {
    console.log('Data to save: ', this.tableForm.value.rows);
    this.progressionService.saveData( this.headerForm.value, this.tableForm.value.rows);
    // this.headerData = this.progressionService.defaultHeader;
    // this.tableData = this.progressionService.defaultTableData;
    this.displayModal = false;
    this.displayTableContentModal = false;
  }

  onColorChange(event: Event, index: number): void {
    const color = (event.target as HTMLInputElement).value;
    if (index === -1) {
      this.selectedHeaderColor = color; // Couleur pour le titre
    } else if (this.colors[index]) {
      this.colors[index] = color; // Mise à jour des couleurs du tableau
    }
  }
 
  // selectChange(event, index, val) {
  //   if(val === 'skill') this.tableForm.value.rows[index].competence =  event.target.value;
  //   else if(val === 'lesson') this.tableForm.value.rows[index].lesson =  event.target.value;
  //   else if(val === 'activity') this.tableForm.value.rows[index].activity =  event.target.value;
  // }

  selectChange(event: any, index: number, field: string): void {
    const value = event.target ? event.target.value : event.value;
  
    // Accéder au groupe de la ligne
    const rowFormGroup = this.tableForm.get(['rows', index]);
  
    if (rowFormGroup) {
      switch (field) {
        case 'skill':
          rowFormGroup.get('competence')?.setValue(value);
          break;
        case 'lesson':
          rowFormGroup.get('lesson')?.setValue(value);
          break;
        case 'activity':
          rowFormGroup.get('activity')?.setValue(value);
          break;
        default:
          console.warn(`Unknown field: ${field}`);
      }
    } else {
      console.warn(`No row found at index ${index}`);
    }
  }
  
  switchList(): void {
    if(this.selectedSkillLesson === '1') {
      this.competences = this.progressionService.competences1;
      this.lessons =  this.progressionService.lessons1;
    } else {
      this.competences = this.progressionService.competences2;
      this.lessons =  this.progressionService.lessons2;
    }
  }

  addRow(): void {
    const newRow = this.formBuilder.group({
      competence: ['', Validators.required],
      lesson: ['', Validators.required],
      activity: ['', Validators.required],
      period: ['', Validators.required],
      sessions: ['', Validators.required],
      hours: ['', Validators.required],
    });
    this.rows.push(newRow);
  }

  // Supprimer une période
  removeRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
    } else {
      console.warn("Impossible de supprimer la dernière ligne.");
    }
  }

  generateFileName() {
    // Récupérer les valeurs du formulaire
    const className = this.f['class'].value;
    const teacherName = this.f['professor'].value;

    // Nettoyer le nom du professeur pour retirer "M." ou "Mme", enlever les espaces, et remplacer les points
    // const cleanedTeacherName = cleanProfessorName(teacherName);

    // Concaténer pour créer le nom du fichier avec des underscores à la place des espaces
    // const fileName = `${className}_${groupName}_${cleanedTeacherName}.pdf`.replace(/\s+/g, '_');
    const fileName = `${className}_${teacherName}`
      .replace(/\s+/g, '_')
      .replace(/\./g, '');
    return fileName;
  }

  async generatePdf() {
    // const { jsPDF } = window.jspdf;
    const jsPdf = new jsPDF({
      orientation: 'landscape', // Mode paysage
      unit: 'pt',
      format: 'a4',
    });

    const element = document.getElementById('pg-content');

    // Use html2canvas to convert the HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Increase resolution
      useCORS: true,
      logging: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Get canvas as image
    // const imgData = canvas.toDataURL('image/png', 0.75);
    const imgData = canvas.toDataURL('image/png');

    // Calculate the width and height for the PDF page (A4 size is 595x842 points)
    const pdfWidth = jsPdf.internal.pageSize.getWidth();
    const pdfHeight = jsPdf.internal.pageSize.getHeight();

    // Scale the image to fit within the PDF page (reduce size if necessary)
    const canvasWidth = canvas.width / 2;
    const canvasHeight = canvas.height / 2;

    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    const imgWidth = canvasWidth * ratio;
    const imgHeight = canvasHeight * ratio;

    // Center the image on the PDF page
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;
    console.log(
      `xoffset: ${xOffset}, yoffset: ${yOffset}, imgw: ${imgWidth}, imgh: ${imgHeight}`
    );
    // Add the image to jsPDF
    // jsPdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    jsPdf.addImage(imgData, 'PNG', xOffset + 5, yOffset + 25, imgWidth, imgHeight);

    // Save or open the generated PDF
    const fileNameToSave = `${this.generateFileName()}.pdf`;
    // jsPdf.save(fileNameToSave);
    // jsPdf.save('doc.pdf');

    // Or to preview in browser:
    // window.open(jsPdf.output('bloburl'));

    // Générer le fichier PDF en tant que Blob
    const blob = jsPdf.output('blob');

    // Créer une URL pour le Blob
    const blobUrl = URL.createObjectURL(blob);

    // Créer un lien <a> caché et le déclencher
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileNameToSave; // Définir le nom de fichier pour le téléchargement
    // a.download = 'doc_ng.pdf'; // Définir le nom de fichier pour le téléchargement
    document.body.appendChild(a);
    a.click(); // Simuler le clic sur le lien pour déclencher le téléchargement
    document.body.removeChild(a); // Supprimer le lien après le clic
  }

  async clearData() {
    if(confirm('Voulez-vous réinitialiser les données ?')) {
      await this.progressionService.clearData();
      // Réinitialiser headerData et tableData
      // this.headerData = this.progressionService.defaultHeader;
      this.initializeHeaderForm(this.progressionService.defaultHeader);
      this.initializeTableForm(this.progressionService.defaultTableData);
    }
  }

}
