import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ml5ClassificationService } from '../../services/ml5-classification/ml5-classification.service';
import { ML5ClassificationResult } from '../../model/ML5ClassificationResult';

import * as d3 from 'd3';

export interface Data {
  letter: string;
  frequency: number;
}


@Component({
  selector: 'app-ml5-d3-chart-viewer',
  templateUrl: './ml5-d3-chart-viewer.component.html',
  styleUrls: ['./ml5-d3-chart-viewer.component.scss'],
})
export class Ml5D3ChartViewerComponent implements OnInit {

  @ViewChild('barChart')
  private chartContainer: ElementRef;

  data: ML5ClassificationResult[] = []

  margin = { top: 48, right: 48, bottom: 48, left: 48 };

  constructor(private ml5Service: Ml5ClassificationService) {
    
    ml5Service.getClassificationResultsObservable().subscribe(results => {
      if (results.length > 0) {
        this.data = results
        this.createChart()
      }
    });
   }

   ngOnInit() { }

   ngOnChanges() {
     if (!this.data) { return; }
 
     this.createChart();
   }
 
   private async createChart() {
    if (!this.data || this.data.length == 0) { return; }
    
     const element = this.chartContainer.nativeElement;
     const data = this.data;

     
 
     d3.select(element).select('svg').remove();
 
     const svg = d3.select(element).append('svg')
       .attr('width', element.offsetWidth)
       .attr('height', element.offsetHeight);
 
     const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
     const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

     const x = d3
       .scaleBand()
       .rangeRound([0, contentWidth])
       .padding(0.1)
       .domain(data.map(d => d.label));
 
     const y = d3
       .scaleLinear()
       .rangeRound([contentHeight, 0])
       .domain([0, d3.max(data, d => d.confidence)]);
 
     const g = svg.append('g')
       .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
 
     g.append('g')
       .attr('class', 'axis axis--x')
       .attr('transform', 'translate(0,' + contentHeight + ')')
       .call(d3.axisBottom(x));
 
     g.append('g')
       .attr('class', 'axis axis--y')
       .call(d3.axisLeft(y).ticks(10, '%'))
       .append('text')
       .attr('transform', 'rotate(-90)')
       .attr('y', 6)
       .attr('dy', '0.71em')
       .attr('text-anchor', 'end')
       .attr('fill', 'black')
       .text('Confidence');
 
     g.selectAll('.bar')
       .data(data)
       .enter().append('rect')
       .attr('class', 'bar')
       .attr('x', d => x(d.label))
       .attr('y', d => y(d.confidence) - 1)
       .attr('width', x.bandwidth())
       .attr("rx", 6)
       .attr('height', d => contentHeight - y(d.confidence));

      g.selectAll("text.bar")
        .data(data)
        .enter().append("text")
        // .attr("class", "bar")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d.label) + + x.bandwidth() / 2; })
        .attr("y", function(d) { return y(d.confidence) - 10; })
        .text(function(d) { return Number((d.confidence*100).toFixed(2)) + ' %' })
        .attr('fill', 'black');
   }
 
   onResize($event) {
     this.createChart();
   }

}
