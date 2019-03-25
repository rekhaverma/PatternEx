import * as d3 from 'd3';

function wrapText(looseText, width) {
  looseText.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    const lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan = text.text(null).append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', `${dy}em`);

    word = words.pop();
    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      /* -- Find a better way to judge the length of hidden text elements -- */
      const textLength = tspan.text().length * 5;

      if (textLength > width) {
        line.pop();
        if (line.length) {
          tspan.text(line.join(' '));
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', `${((lineNumber + 1) * lineHeight) + dy}em`);
        }
        line = [word];
        tspan.text(line.join(' '));
      }
      word = words.pop();
    }
  });
}

const othersSliceColor = '#3498DB';
export const createStackedBarChart = (params) => {
  const domEle = params.container;
  if (params && params.barChartData && params.barChartData.length && params.barChartData[0] &&
    Object.keys(params.barChartData[0]).length > 1) {
    const data = params.barChartData;
    const margin = Object.assign({
      'top': 50,
      'right': 20,
      'bottom': 40,
      'left': 40,
    }, params.margin);
    const width = domEle.offsetWidth - margin.left - margin.right;
    const height = params.height - margin.top - margin.bottom;
    let fields = params.fields;
    const maxSlice = params.maxSlice;
    const yAxisText = params.yAxisText;
    const header = params.header;
    const xScale = d3.scaleBand().range([0, width]).padding(0.3);
    const yScale = d3.scaleLinear().range([height, 0]);
    let color = params.colors;
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat(d3.format('d'));
    const svg = d3.select(domEle).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (maxSlice && data && data.length) {
      const keysLength = Object.keys(data[0]).length;
      if (keysLength > maxSlice) {
        data.forEach((d, i) => {
          let nonZeroCounter = 0;

          if (d) {
            data[i].Others = 0;

            Object.keys(d).forEach((key) => {
              if (key !== 'name' && d[key] !== 0) {
                nonZeroCounter += 1;
              }
            });

            if (nonZeroCounter > maxSlice) {
              const keysSorted = Object.keys(d).filter(key => key !== 'name').sort((a, b) => d[a] - d[b]);

              const sliceCounter = (maxSlice - 1);
              const remCounter = keysLength - sliceCounter;

              if (remCounter) {
                let othersCount = 0;
                keysSorted.slice(0, remCounter).forEach((key) => {
                  othersCount += d[key];
                  data[i][key] = 0;
                });
                data[i].Others = othersCount;
              }
            }
          }
        });

        // Remove tags with no values
        const legendMap = {};

        data.forEach((d) => {
          Object.keys(d).forEach((key) => {
            if (key !== 'name') {
              if (d[key] !== 0) {
                legendMap[key] = 1;
              } else {
                legendMap[key] = legendMap[key] || 0;
              }
            }
          });
        });

        fields.push('Others');
        color.push(othersSliceColor);

        Object.keys(legendMap).forEach((key) => {
          if (legendMap[key] === 0) {
            if (key === 'Others') {
              fields.pop();
              color.pop();
            }

            data.forEach((d, i) => {
              delete data[i][key];
              const sliceIndex = fields.indexOf(key);
              if (sliceIndex >= 0) {
                color = color.slice(0, sliceIndex).concat(color.slice(sliceIndex + 1));
                fields = fields.slice(0, sliceIndex).concat(fields.slice(sliceIndex + 1));
              }
            });
          }
        });
      }
    }

    const stack = d3.stack()
      .keys(Object.keys(data[0]).slice(1));

    const layers = stack(data);

    const xAxisDomain = data.map(d => d.name);
    xScale.domain(xAxisDomain);
    yScale.domain([0, (d3.max(layers[layers.length - 1], d => d[1])) + 5]);

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height + 5})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(0,0)')
      .call(yAxis);

    d3.selectAll('g.axis.axis--x g.tick line')
      .attr('y2', (d, index) => {
      // d for the tick line is the value
      // of that tick
      // (a number between 0 and 1, in this case)
        if (index % 2) { // if it's an even multiple of 10%
          return 25;
        }
        return 10;
      });

    d3.selectAll('g.axis.axis--x g.tick text')
      .attr('y', (d, index) => {
        if (index % 2) { return 27; }
        return 10;
      });

    const layer = svg.selectAll('g.stack-bar')
      .data(layers)
      .enter().append('g')
      .attr('class', 'stack-bar')
      .style('fill', (d, i) => color[i]);

    const tooltip = svg.append('g')
      .attr('class', 'stack-graph-tooltip')
      .style('display', 'none');

    tooltip.append('rect')
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'white')
      .style('opacity', 0.5);

    tooltip.append('text')
      .attr('x', 5)
      .attr('dy', '1.2em')
      .style('text-anchor', 'left')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    layer.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.data.name))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .on('mouseover', () => {
        tooltip.style('display', null);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      })
      .on('mousemove', function (d) {
        const xPosition = d3.mouse(this)[0] - 15;
        const yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr('transform', `translate(${xPosition},${yPosition})`);
        const d3ToolText = tooltip.select('text');
        d3ToolText.text(d[1] - d[0]);
        tooltip.select('rect').attr('width', (d3ToolText._groups[0][0].getComputedTextLength() || 30) + 10);
      });

    // Header Text
    svg.append('text')
      .attr('class', 'header')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(header)
      .style('font-size', '16')
      .attr('x', function () { return ((width - this.getComputedTextLength()) / 2) + 2; })
      .attr('y', (margin.top - 5) / -2);

    // Y axis label
    svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'middle')
      .text(yAxisText)
      .attr('x', () => 0 - (height / 2))
      .attr('y', () => 0 - (margin.left / 2))
      .attr('dy', '-1em')
      .attr('transform', 'rotate(-90)');
  }
};

export const createBarChart = (params) => {
  let svg;
  if (params && params.barChartData && params.barChartData.length) {
    let barChartData = params.barChartData;
    const container = params.container;
    const yAxisText = params.yAxisText;
    const header = params.header;
    const maxWidth = params.width || container.offsetWidth;
    const maxHeight = params.height || 500;
    const maxSlice = params.maxSlice;
    const showColor = Object.prototype.hasOwnProperty.call(barChartData[0], 'color');

    if (maxSlice && barChartData.length > maxSlice) {
      barChartData = barChartData.sort((a, b) => a.value - b.value);
      const sliceCounter = maxSlice - 1;
      const remCounter = barChartData.length - sliceCounter;

      if (remCounter) {
        let othersCount = 0;
        barChartData.slice(0, remCounter).forEach(data => othersCount += data.value);
        barChartData = barChartData.slice(-sliceCounter);
        barChartData.push({ 'name': 'Others', 'value': othersCount });
      }
    }

    const margin = {
      'top': 50,
      'right': 160,
      'bottom': 50,
      'left': 30,
    };
    const width = maxWidth - margin.left - margin.right;
    const height = maxHeight - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.5);
    const y = d3.scaleLinear().range([height, 0]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
      .tickSize(-width, 0, 0)
      .tickFormat(d => d);

    svg = d3.select(container).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(barChartData.map(d => d.name));
    y.domain([0, d3.max(barChartData, d => d.value)]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('.tick text')
      .call(wrapText, x.bandwidth());

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .style('font-size', '12')
      .text(yAxisText);

    svg.selectAll('.bar')
      .data(barChartData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .style('fill', (d) => {
        if (showColor) {
          return d.color || othersSliceColor;
        }
        return 'steelblue';
      });

    // Draw legend
    const legend = svg.selectAll('.legend')
      .data(barChartData)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(30,${i * 19})`);

    legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => d.color || othersSliceColor);

    legend.append('text')
      .attr('x', width + 5)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d.name);

    svg.selectAll('.bartext')
      .data(barChartData)
      .enter().append('text')
      .attr('class', 'bartext')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('x', d => x(d.name) + (x.bandwidth() / 2))
      .attr('y', d => Math.min(height - 10, y(d.value) + 20))
      .text(d => d.value);

    svg.append('text')
      .attr('class', 'header')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(header)
      .style('font-size', '16')
      .attr('x', function () {
        return (maxWidth - this.getComputedTextLength()) / 2;
      })
      .attr('y', margin.top / -2);
  }
};
