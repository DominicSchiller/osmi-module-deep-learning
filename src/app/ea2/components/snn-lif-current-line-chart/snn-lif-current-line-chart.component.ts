import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { LIFSimulationDataUpdate } from '../../model/snn/snn-types';

@Component({
  selector: 'app-snn-lif-current-line-chart',
  templateUrl: './snn-lif-current-line-chart.component.html',
  styleUrls: ['./snn-lif-current-line-chart.component.scss'],
})
export class SNNLIFCurrentLineChartComponent implements OnInit {

  private _data: LIFSimulationDataUpdate = null

  @Input('data')
  public set dataIn(val) {
    this._data = val;
    if (this.chartContainer) {
      this.updateChart();
    }
  }

  private _showMean: boolean = false

  @Input('showMean')
  public set meanIn(showMean) {
    this._showMean = showMean
    if (this.chartContainer) {
      this.updateChart();
    }
  }

  @ViewChild('lifLineChart')
  private chartContainer: ElementRef;
 
  /**
   * The chart's margin
   */
  private margin = { top: 12, right: 24, bottom: 24, left: 36 };

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
     if(!this._data) { return }

     const duration = 0
     // Create the X axis:
     this.x.domain([0, d3.max(this._data.currents, d => d.t) ]);
     this.svg.selectAll(".myXaxis").transition()
       .duration(duration)
       .call(this.xAxis);
 
     // create the Y axis
     this.y.domain([0, d3.max(this._data.currents, d => d.i) ]);
     this.svg.selectAll(".myYaxis")
       .transition()
       .duration(duration)
       .call(this.yAxis);

    this.drawDataLine("i", duration, "#6495ED")
   }

   private drawDataLine(yDataPropertyName: string, duration: number, color: string) {
     // Create a update selection: bind to the new data
     var u = this.svg.selectAll(`.data-line-${yDataPropertyName}`)
       .data([this._data.currents], d => d[yDataPropertyName]);
 
     // Updata the line
     const that = this
     u
     .enter()
     .append("path")
     .attr("class",`data-line-${yDataPropertyName}`)
     .merge(u)
     .transition()
     .duration(duration)
     .attr("d", d3.line()
       .x(d => that.x(d.t))
       .y(d => that.y(d[yDataPropertyName])))
       .attr("fill", "none")
       .attr("stroke", color)
       .attr("stroke-width", 2)
   }

   private drawThresholdLine(color: string, duration: number) {
     const threshold = this._data.uThreshold
    // Create a update selection: bind to the new data
    var u2 = this.svg.selectAll(".threshold-line")
    .data([this._data.currents], d => d.t);


      // Updata the line
      u2
      .enter()
      .append("path")
      .attr("class","threshold-line")
      .merge(u2)
      .transition()
      .duration(duration)
      .attr("d", d3.line()
        .x(d => this.x(d.t))
        .y(d => this.y(threshold)))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
   }

   /**
    * Window reseize event handler.
    * @param $event the window resize event
    */
   onResize($event) {
     this.createChart();
   }

}
