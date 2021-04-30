import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ISNNChartData2D } from '../../model/charts/snn-chart-data-2d';

@Component({
  selector: 'app-snn-line-chart',
  templateUrl: './snn-line-chart.component.html',
  styleUrls: ['./snn-line-chart.component.scss'],
})
export class SnnLineChartComponent implements OnInit {

  private _data: ISNNChartData2D[] = []

  @Input('data')
  public set in(val) {
    this._data = val;
   
    if (this.chartContainer) {
      this.updateChart();
    }
  }

  @ViewChild('lineChart')
  private chartContainer: ElementRef;
 
  /**
   * The chart's margin
   */
  private margin = { top: 12, right: 24, bottom: 24, left: 24 };

  /**
   * The current D3 SVG instance
   */
  private svg: any
  /**
   * The x-axis data range
   */
  private x: any
  /**
   * The actual x-axis
   */
  private xAxis: any
  /**
   * The y-axis data range
   */
  private y: any
  /**
   * The actual y-axis
   */
  private yAxis: any

  /**
   * Constructor
   */
  public constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
   setTimeout(() => {
    this.createChart()
    this.updateChart()
   }, 50)
  }
 
  /**
   * Create the SVG chart
   */
   createChart() {
     const element = this.chartContainer.nativeElement;
     d3.select(element).select('svg').remove();

     const width =  element.offsetWidth
     const height =  element.offsetHeight

     const contentWidth = width - this.margin.left - this.margin.right;
     const contentHeight = height - this.margin.top - this.margin.bottom;
 
     // append the svg object to the body of the page
     this.svg = d3.select(element)
       .append("svg")
       .attr("width", width)
       .attr("height", height)
       .append("g")
       .attr("transform",
         "translate(" + this.margin.left + "," + this.margin.top + ")");
 
     // Initialise a X axis:
     this.x = d3.scaleLinear().range([0, contentWidth]);
     this.xAxis = d3.axisBottom().scale(this.x);
     this.svg.append("g")
       .attr("transform", "translate(0," + contentHeight + ")")
       .attr("class","myXaxis")
 
     // Initialize an Y axis
     this.y = d3.scaleLinear().range([contentHeight, 0]);
     this.yAxis = d3.axisLeft().scale(this.y);
     this.svg.append("g")
       .attr("class","myYaxis")
   }
 
   /**
    * Update the chart with received data update
    */
   updateChart() {
     const duration = 0
     // Create the X axis:
     this.x.domain([d3.min(this._data, d => d.x), d3.max(this._data, d => d.x) ]);
     this.svg.selectAll(".myXaxis").transition()
       .duration(duration)
       .call(this.xAxis);
 
     // create the Y axis
     this.y.domain([d3.min(this._data, d => d.y), d3.max(this._data, d => d.y) ]);
     this.svg.selectAll(".myYaxis")
       .transition()
       .duration(duration)
       .call(this.yAxis);
 
     // Create a update selection: bind to the new data
     var u = this.svg.selectAll(".lineTest")
       .data([this._data], d => d.x);
 
     // Updata the line
     const that = this
     u
     .enter()
     .append("path")
     .attr("class","lineTest")
     .merge(u)
     .transition()
     .duration(duration)
     .attr("d", d3.line()
       .x(d => that.x(d.x))
       .y(d => that.y(d.y)))
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2.5)
   }

   /**
    * Window reseize event handler.
    * @param $event the window resize event
    */
   onResize($event) {
     this.createChart();
   }

}
