// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Chart, registerables } from 'chart.js';
// import { ML5ClassificationResult } from '../../model/ML5ClassificationResult';
// import { Ml5ClassificationService } from '../../services/ml5-classification/ml5-classification.service';
// Chart.register(...registerables); // required to get chart.js working !

// @Component({
//   selector: 'app-classification-chart',
//   templateUrl: './classification-chart.component.html',
//   styleUrls: ['./classification-chart.component.scss'],
// })
// export class ClassificationChartComponent implements OnInit {

//   @ViewChild('barCanvas') private barCanvas: ElementRef;
//   barChart: any;

//   constructor(private ml5Service: Ml5ClassificationService) { 

//     ml5Service.getClassificationResultsObservable().subscribe(results => {
//       if (this.barChart != null && this.barChart != undefined) {
//         this.updateBarChart(results);
//       }
//     });

//   }

//   ngOnInit() {}

//   ngAfterViewInit() {
//     setTimeout(() => {  this.createBarChart(); }, 150);
//   }

//   async createBarChart() {

//     const labels = [];
//     const data = {
//       labels: labels,
//       datasets: [{
//         label: 'Confidences in %',
//         data: [],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(255, 159, 64, 0.2)',
//           'rgba(255, 205, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(201, 203, 207, 0.2)'
//         ],
//         borderColor: [
//           'rgb(255, 99, 132)',
//           'rgb(255, 159, 64)',
//           'rgb(255, 205, 86)',
//           'rgb(75, 192, 192)',
//           'rgb(54, 162, 235)',
//           'rgb(153, 102, 255)',
//           'rgb(201, 203, 207)'
//         ],
//         borderWidth: 1
//       }]
//     };

//     this.barChart = new Chart(this.barCanvas.nativeElement, {
//       type: 'bar',
//       data: data,
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           y: {
//             suggestedMin: 0,
//             suggestedMax: 100
//           }
//         },
        
//       }
//     });
//   }

//   async updateBarChart(results: ML5ClassificationResult[]) {
//     console.log("Updating");
//     let labels = results.map(result => result.label);
//     let confValues = results.map(result => result.confidence * 100)

//     this.barChart.data.labels = labels;
//     this.barChart.data.datasets[0].data = confValues;
//     this.barChart.update();
//   }
// }
