import * as d3 from "d3";

/**
 * TODOS :
 * modularize
 * optimize dom
 * optimize d3 usage
 * make the component updatable
 * add init / update transition
 * throw error when something fails
 * make the component responsive
 * omptimize d3 import
 */

export class DonutTrio extends HTMLElement {
  constructor() {
    super();
  }

  //gets interpolated when adding to dom to inject external data
  getTemplate(values){

    const {center:{
        label:centerLabel,
        value:centerValue
      },
      left:{
        label:leftLabel,
        labelColor:leftLabelColor,
        percent:leftPercent,
        value:leftValue,
      },
      right:{
        label:rightLabel,
        labelColor:rightLabelColor,
        percent:rightPercent,
        value:rightValue,
      }
    } = values;
    return `
    <style>
      .donut{
        font-family: Roboto, Arial;
        margin: 0;
        padding: 0;
        position: relative;
        height: 14rem;
        width: 20rem;
      }
      #donutGraph,#tickMarks,#areaGraph{
        position: absolute;
        margin-top: -77px;
        margin-left: -77px;
        top: 50%;
        left: 50%;
      }
      .centerFigureText{
        position: absolute;
        height: 3rem;
        top: 50%;
        margin-top: -2.1rem;
        width: 100%;
        line-height: 1.4rem;
      }
      .centerLabel{
        color: #a1a1a1;
        font-size: 17px;
        text-transform: uppercase;
      }
      .centerValue{
        font-size: 22px;
      }
      .centerFigure{
        position: relative;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        height: 12.3rem;
        width: 15rem;
      }
      .leftFigure,.rightFigure{
        font-size: 14px;
        position: absolute;
        bottom: 0.6rem;
      }
      .leftFigure{
        left: 0;
      }
      .leftFigure>.label{
        color: ${leftLabelColor};
      }
      .rightFigure>.label{
        color: ${rightLabelColor};
      }
      .label{
        text-transform: capitalize;
        font-size: 15px;
        font-weight: bold;
      }
      .percent{
        margin-right: 0.2rem;
      }
      .value{
        color: #bdbdbd;
      }
      .rightFigure{
        text-align: right;
        right: 0;
      }
      .bottomFigures{
        width: calc(100% - 4rem);
        position: absolute;
        border-bottom: 1px solid #e6e6e6;
        margin-left: 1.9rem;
        bottom: 0;
      }
    </style>
    <div class="donut">
      <div class="centerFigure">
        <div id="donutGraph" ></div>
        <div id="tickMarks" ></div>
        <div id="areaGraph" ></div>
        <div class="centerFigureText">
          <span class="centerLabel">${centerLabel}</span><br>
          <span class="centerValue">${centerValue}</span>
        </div>
      </div>
      <div class="bottomFigures">
        <div class="leftFigure">
          <span class="label">${leftLabel}</span><br>
          <span class="percent">${leftPercent}</span>
          <span class="value">${leftValue}</span>
        </div>
        <div class="rightFigure">
          <span class="label">${rightLabel}</span><br>
          <span class="percent">${rightPercent}</span>
          <span class="value">${rightValue}</span>
        </div>
      </div>
    </div>
  `;
  }

  appendTemplate(data){
    const template = document.createElement('template');
    template.innerHTML = this.getTemplate(data);
    this._shadow.appendChild(template.content.cloneNode(true));
  }

  //public setter to provide data to this component
  set data(value){
    if(this._data !== undefined) return;//remove this when component handles update
    // Creates a shadow root
    this._shadow = this.attachShadow({mode: 'open'});
    if(value.center && value.left && value.right){
      this._data = value;
      this.appendTemplate(this._data);
      this.drawGraphs(this._shadow,this._data,);
    }else{
      throw Error("ERROR - DonutTrio - malformed data");
    }
  }

  /*
  Donut Chart
  */
  drawDonutGraph(element,inputData,width,height){
    
    const percentScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 2 * Math.PI]);

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform","translate(" + width/2 +","+ height/2 +")");

    /*
    transforms following incoming json data
    [{"value":40,"color":"#507439"},{"value":60,"color":"#92d657"}]
    into following graph oriented format
    [[0,40,"#507439"],[40,100,"#92d657"]]
    */
    let currentValue = 0;
    const donutData = inputData.map((item)=>{
      let newItem = [
        currentValue,
        currentValue+item.value,
        item.color
      ]
      currentValue = item.value;
      return newItem;
    });

    const arc = d3.arc()
      .innerRadius(71)
      .outerRadius(77)
      .startAngle((d) => percentScale(d[0]))
      .endAngle((d) => percentScale(d[1]));

    svg.selectAll("path")
      .data(donutData)
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", (d) => d[2]);
    
  }
  
  /*
  Tick Marks
  */
  drawTickMarks(element,width,height){

    const percentScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 2 * Math.PI]);

    const tMInnerRadius = 67;
    const tMOuterRadius = 69;
    
    const svg = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+ width/2 +","+ height/2 +")");

    const tickMarksData = [[-0.1,0.1],
      [24.9,25.1],
      [49.9,50.1],
      [74.9,75.1]];

    const tMArc = d3.arc()
      .innerRadius(tMInnerRadius)
      .outerRadius(tMOuterRadius)
      .startAngle((d) => percentScale(d[0]))
      .endAngle((d) => percentScale(d[1]));

    svg.selectAll("path")
      .data(tickMarksData)
      .enter()
      .append("path")
      .attr("d", tMArc)
      .style("fill", "#808080");
  }
  /*
  Area Graph
  */
  drawAreaGraph(element,inputData,width,height){

    const percentScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 2 * Math.PI]);

    /*
    transforms following incoming json data
    [24.800262527533583,24.686999391883376,24.594174251027752, ... ...]
    into following graph oriented format
    [[0,24.800262527533583],[1,24.800262527533583]]
    TODO get rid of transformation by improving drawing procedure
    */
    const areaChartData = inputData.data.map((item,i) => [i,item]);

    const svg = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+ width/2 +","+ height/2 +")");

    //circle mask applied to the area chart
    svg.append("clipPath")
      .attr("id", "circleClip")
      .append("ellipse")
      .attr("cx", 0)          //x-centre
      .attr("cy", 0)          //y-centre
      .attr("rx", width/2-12) //x radius
      .attr("ry", width/2-12);//y radius

    //100 item indexes used as x, scaled onto area's width
    const x = d3.scaleLinear()
      .domain([0,100])
      .range([ -width/2, width/2 ]);

    //item values start at 25 and stay below 100, scaled onto area's height
    const y = d3.scaleLinear()
      .domain([0,100])
      .range([ height/2,-height/2 ]);

    /*svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("transform", "scaleY(-1)")*/
        
    // Add the area
    svg.append("path")
      .datum(areaChartData)
      .attr("fill", inputData.areaColor)
      .attr("fill-opacity", 0.1)
      .attr("stroke", inputData.lineColor)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.3)
      .attr("clip-path","url(#circleClip)")
      .attr("d", d3.area()
          .x((d) => x(d[0]))
          .y0(y(0))
          .y1((d) => y(d[1]))
      )

  }
  //draws graphs using d3 library
  drawGraphs(shadow,data){
    /*
    Initial SVG values
    */
    const width = 154;
    const height = 154;

    this.drawDonutGraph(shadow.querySelector("#donutGraph"),data.center.donut,width,height);
    this.drawTickMarks(shadow.querySelector("#tickMarks"),width,height);
    this.drawAreaGraph(shadow.querySelector("#areaGraph"),data.center.areaGraph,width,height);
  }
}