import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ISNNChartData2D } from '../../model/charts/snn-chart-data-2d';
import { GlobalSpikesInfo, IGlobalSpikesUpdate } from '../../model/snn/snn-types';

@Component({
  selector: 'app-snn-scatter-chart',
  templateUrl: './snn-scatter-chart.component.html',
  styleUrls: ['./snn-scatter-chart.component.scss'],
})
export class SnnScatterChartComponent implements OnInit {

  private _data: IGlobalSpikesUpdate = null

  @Input('data')
  public set in(val) {
    this._data = val;
    if (this.chartContainer) {
      this.updateChart();
    }
  }

  @ViewChild('scatterChart')
  private chartContainer: ElementRef;
 
  /**
   * The chart's margin
   */
  private margin = { top: 12, right: 28, bottom: 24, left: 28 };

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
   private createChart() {
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
   private updateChart() {
     if (!this._data) { return }

     console.log("will update scatter chart");
     const duration = 0
     // Create the X axis:
     this.x.domain([0, 1000]);
     this.svg.selectAll(".myXaxis").transition()
       .duration(duration)
       .call(this.xAxis);
 
     // create the Y axis
     this.y.domain([0, 1000]);
     this.svg.selectAll(".myYaxis")
       .transition()
       .duration(duration)
       .call(this.yAxis);
 
     this.updatePoints(this._data.inhibitorySpikes, "excitatorySpikes",  "MidnightBlue", duration)
     this.updatePoints(this._data.excitatorySpikes, "excitatorySpikes",  "Tomato", duration)
   }

   private updatePoints(spikesInfo: GlobalSpikesInfo[], pointsClassName: string, color: string, duration: number = 0) {
     // Create a update selection: bind to the new data
     var update = this.svg.selectAll(`.${pointsClassName}-datapoints`)
      .data(spikesInfo);
 
     // Updata the line
     const that = this
     update
     .enter()
     .append("g")
     .attr("class", "datapoints")
     .merge(update)
     .append("circle")
      .attr("cx", d => that.x(d.t))
      .attr("cy", d => that.y(d.totalNeurons))
      .attr("r", 2.0)
      .style("fill", color)

      // animation
      this.svg.selectAll("circle")
        .transition()
      .duration(duration)
      .attr("cx", d => that.x(d.t))
      .attr("cy", d => that.y(d.totalNeurons))
   }

   /**
    * Window reseize event handler.
    * @param $event the window resize event
    */
   onResize($event) {
     this.createChart();
   }

}
