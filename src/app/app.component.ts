import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterOutlet, CommonModule, FormsModule, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  // colors: string[] = ['#d9edf7', '#dff0d8'];

  displayModal = false;
  displayTableContentModal = false;

  selectedHeaderColor: string = '#F56666';

  progressionService = inject(ProgressionEpsService);

  headerData: IHeaderData;
  tableData: ITableData[];
  competences;
  lessons;
  activities;
  selectedSkillLesson: string = '1';

  colors: string[] = ['#d9edf7', '#dff0d8'];

  ngOnInit() {
    this.competences = this.progressionService.competences1;
    this.lessons =  this.progressionService.lessons1;
    this.activities =  this.progressionService.activities;

    this.headerData = this.progressionService.getHeaderData();
    this.tableData = this.progressionService.getTableData();
  }

  saveEpsProgressionData(): void {
    console.log('Data to save: ', this.headerData);
    this.progressionService.saveData(this.headerData, this.tableData);
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

  selectChange(event, index, val) {
    if(val === 'skill') this.tableData[index].competence =  event.target.value;
    else if(val === 'lesson') this.tableData[index].lesson =  event.target.value;
    else if(val === 'activity') this.tableData[index].activity =  event.target.value;
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

  saveTableData() {
    localStorage.setItem('tableData', JSON.stringify(this.tableData));
  }

  addRow(): void {
    this.tableData.push({
      period: '',
      sessions: 0,
      hours: 0,
      competence: '',
      lesson: '',
      activity: ''
    });
  }

  // Supprimer une période
  removeRow(index: number): void {
    if (this.tableData.length > 1) {
      this.tableData.splice(index, 1);
    } else {
      alert('Impossible de supprimer la dernière période !');
    }
  }

  generateFileName() {
    // Récupérer les valeurs du formulaire
    const className = this.headerData.class;
    const teacherName = this.headerData.professor;

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


}
