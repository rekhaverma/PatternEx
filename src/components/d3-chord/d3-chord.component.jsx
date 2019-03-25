import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { isEqual } from 'lodash';

import chordIcons from 'public/icons/chord';
import pipelineToName from 'lib/decorators/pipeline-to-name';
import { behaviours } from 'config';

import {
  getBehaviorOccurrences,
  calcHypotenuse,
  ungroupOpenPipelines,
  augmentDataFlows,
  getFlowBehavior,
} from 'lib/chord';

import './d3-chord.style.scss';

const d3ItemsConfig = {
  'flowBeta': 0.2, // 0 - 1: how much the flow should draw close the center
  'radiansFlipLabel': Math.PI / 1.6, // below x-axis (-90 rotation) or grater than PI/2
  'iconWidth': 30,
  'iconHeight': 25,
  'iconCloseWidth': 25,
  'iconCloseHeight': 16,
  'mIconSize': 20,
  'iconsDistance': 60,
  'closeIconDistance': 20,
};

const removeTooltip = () => {
  d3.selectAll('.popper-wrap').remove();
};

const pie = d3.pie()
  .startAngle(0)
  .endAngle((Math.PI / 2) + (2 * Math.PI))
  .value(d => d[1])
  .sort(null);

const flowLine = d3.line()
  .x(d => d.x)
  .y(d => d.y)
  .curve(d3.curveBundle.beta(d3ItemsConfig.flowBeta));

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

const getIconColor = (iconName, behavior) => {
  if (behavior !== null && behavior !== undefined) {
    if (behavior.toLowerCase() === behaviours.MALICIOUS) {
      return chordIcons[`${iconName}R`];
    }
    if (behavior.toLowerCase() === behaviours.SUSPICIOUS) {
      return chordIcons[`${iconName}Y`];
    }
    // 'Unknown'
    return chordIcons[`${iconName}`];
  }
  return chordIcons[`${iconName}`];
};

const appendTooltip = (xPos, yPos) => {
  const tooltip = d3.select('.chord').append('div')
    .attr('data-placement', 'bottom')
    .attr('class', 'popper-wrap')
    .style('position', 'absolute');
  tooltip.append('div')
    .attr('class', 'popper');

  const tooltipNode = d3.select('.popper-wrap');

  const tooltipGap = {
    'x': (tooltipNode.node().clientWidth / 2),
    'y': (tooltipNode.node().clientHeight / 2),
  };

  tooltip.style('left', `${xPos - tooltipGap.x}px`)
    .style('top', `${yPos + tooltipGap.y}px`);
};

const populateClusterTooltip = (type, value) => {
  const tooltipBox = d3.select('.popper');

  tooltipBox.append('div')
    .attr('class', 'popper__info')
    .append('span')
    .html(() => `${type ? `${capitalize(type)}:` : ''} `)
    .append('span')
    .attr('class', `highlight popper__info +${value}`)
    .html(() => value);
};

const getTooltipData = (d, dataType) => {
  if (dataType === 'cluster') {
    if (d.data[0].length === 1) {
      populateClusterTooltip('entity', d.data[0][0].entity_name);
      populateClusterTooltip('behavior', d.data[3]);
    } else {
      populateClusterTooltip('entities', d.data[0].length);

      const behaviorTypes = ['malicious', 'suspicious', 'unknown'];

      behaviorTypes.forEach((type) => {
        const behaviorOccurrences = getBehaviorOccurrences(d.data[0], type);
        if (behaviorOccurrences > 0) {
          populateClusterTooltip(type, behaviorOccurrences);
        }
      });
    }
  } else {
    // dataType = flows
    populateClusterTooltip('startIP', d[0].start_ip);
    populateClusterTooltip('endIP', d[3].end_ip);
  }
};

export default class D3Chord extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      'config': {},
      'openPipelines': [],
    };

    this.svgNode = null;
    this.hoverTimeout = null;
    this.injectD3 = this.injectD3.bind(this);
    this.addOpenPipeline = this.addOpenPipeline.bind(this);
    this.removeOpenPipeline = this.removeOpenPipeline.bind(this);
  }

  componentWillMount() {
    const { config } = this.props;
    this.setConfigProps(config);
  }

  componentDidMount() {
    const { config, entities, relations } = this.props;
    if (entities.length > 0
      && entities.find(entity => entity.entity_name && entity.entity_type) !== undefined
      && relations.length > 0) {
      this.injectD3(config);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.config, nextProps.config)) {
      this.setConfigProps(nextProps.config);
    }
    return false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.relations, nextProps.relations)
      || !isEqual(this.props.entities, nextProps.entities)) {
      return true;
    }
    if (!isEqual(this.props.selectedEntity, nextProps.selectedEntity)) {
      return true;
    }
    if (!isEqual(this.state.openPipelines, nextState.openPipelines)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { config, entities, relations } = this.props;
    if (entities.length > 0 && relations.length > 0) {
      this.injectD3(config);
    }
  }

  setConfigProps(config) {
    this.setState({ config }, () => { this.injectD3(this.state.config); });
  }

  setArcsDistance(pieData) {
    const { openPipelines } = this.state;
    const { entities } = this.props;

    let openPie = pieData;
    if (pieData.length > 1) {
      openPie = pieData.map((arc) => {
        if (openPipelines.includes(arc.data[2])) {
          const initialCluster = entities.filter(entity => entity[2] === arc.data[2])[0];
          const firstClusterEntity = initialCluster[0][0];
          const lastClusterEntity = initialCluster[0][initialCluster[0].length - 1];
          if (initialCluster[0].length === 1) {
            // one entity/cluster
            return {
              ...arc,
              'endAngle': arc.endAngle - 0.035,
              'startAngle': arc.startAngle + 0.035,
            };
            // 2 entities/cluster
          } else if (initialCluster[0].length === 2) {
            // first entity from 2entities/cluster
            if (arc.data[0][0] === firstClusterEntity) {
              return {
                ...arc,
                'startAngle': arc.startAngle + 0.035,
                'endAndle': arc.endAndle - 0.015,
              };
            }
            // second entity from 2entities/cluster
            return {
              ...arc,
              'startAngle': arc.startAngle + 0.015,
              'endAngle': arc.endAngle - 0.035,
            };
          }
          // more then 2 items/arc
          if (arc.data[0][0] === firstClusterEntity) {
            return {
              ...arc,
              'startAngle': arc.startAngle + 0.035,
              'endAngle': arc.endAngle - 0.007,
            };
          } else if (arc.data[0][0] === lastClusterEntity) {
            return {
              ...arc,
              'startAngle': arc.startAngle + 0.007,
              'endAngle': arc.endAngle - 0.035,
            };
          }
          return {
            ...arc,
            'endAngle': arc.endAngle - 0.007,
            'startAngle': arc.startAngle + 0.007,
          };
        }
        // All clusters closed
        return {
          ...arc,
          'endAngle': arc.endAngle - 0.035,
          'startAngle': arc.startAngle + 0.035,
        };
      });
    }
    return openPie;
  }

  getEntityBehavior(ip) {
    const { entities } = this.props;

    let entityBehavior = '';
    entities.forEach((cluster) => {
      cluster[0].forEach((entity) => {
        if (entity.entity_name && entity.entity_name === ip) {
          entityBehavior = entity.behavior;
        }
      });
    });

    return entityBehavior;
  }

  getCentroid(d) {
    return this.arc().centroid(d);
  }

  getIconPosition(d, hasMultipleEntities, isCloseIcon) {
    let x; let y;

    if (hasMultipleEntities) {
      const data = {
        'startAngle': d[0].startAngle,
        'endAngle': d[d.length - 1].endAngle,
      };

      if (isCloseIcon) {
        x = this.getCentroid(data)[0] - (d3ItemsConfig.iconCloseWidth / 2);
        y = this.getCentroid(data)[1] - (d3ItemsConfig.iconCloseHeight / 2);
      } else {
        x = this.getCentroid(data)[0] - (d3ItemsConfig.iconWidth / 2);
        y = this.getCentroid(data)[1] - (d3ItemsConfig.iconHeight / 2);
      }
    } else {
      x = this.getCentroid(d)[0] - (d3ItemsConfig.iconWidth / 2);
      y = this.getCentroid(d)[1] - (d3ItemsConfig.iconHeight / 2);
    }

    const distance = calcHypotenuse(x, y);
    const iconClusterDistance = isCloseIcon
      ? distance + d3ItemsConfig.closeIconDistance
      : distance + d3ItemsConfig.iconsDistance;
    const r = iconClusterDistance / distance;
    return {
      'x': r * x,
      'y': r * y,
    };
  }

  addOpenPipeline(pipeline) {
    this.setState(prevState => ({
      'openPipelines': [...prevState.openPipelines, pipeline],
    }));
  }

  removeOpenPipeline(pipeline) {
    const newPipelines = this.state.openPipelines.filter(item => item !== pipeline);

    this.setState({
      'openPipelines': newPipelines,
    }, () => {
      this.props.setSelectedEntity(pipeline);
    });
  }

  arc() {
    return d3.arc()
      .innerRadius(this.state.config.chordRadius)
      .outerRadius(this.state.config.chordRadius + (this.state.config.chordStroke * 2));
  }

  addArcs(svg) {
    const { entities, selectedEntity, setSelectedEntity } = this.props;
    const { openPipelines } = this.state;

    // check for open pipelines
    let groupedEntities = entities;
    if (openPipelines.length > 0) {
      groupedEntities = ungroupOpenPipelines(entities, openPipelines);
    }

    const pieData = this.setArcsDistance(pie(groupedEntities));

    const chordLayer = svg.select('.chord');
    const arcsGroupData = chordLayer.selectAll('.arcSlice')
      .data(pieData);

    const arcsCentroids = {};
    // ENTER
    arcsGroupData.enter()
      .append('path')
      .attr('class', 'arcSlice')
      .attr('d', this.arc());
    // UPDATE
    arcsGroupData
      .attr('class', (d) => {
        const entityName = d.data[0][0].entity_name;
        if (entityName === selectedEntity) {
          return `arcSlice +${d.data[3]}Arc`;
        }
        return 'arcSlice';
      })
      .attr('d', this.arc());
    // EXIT
    arcsGroupData.exit().remove();

    chordLayer.selectAll('.arcSlice').each((d) => {
      if (d.data[0].length > 0) {
        const cluster = d.data[0];
        cluster.forEach((entity) => {
          arcsCentroids[entity.entity_name] = this.arc().centroid(d);
        });
      }
    });
    // MOUSE HANDLERS
    chordLayer.selectAll('.arcSlice').on('click', (d) => {
      // one entity is clicked
      // highlight the entity
      if (d.data[0].length === 1) {
        const entityName = d.data[0][0].entity_name;
        chordLayer.selectAll('.arcSlice')
          .attr('class', (data) => {
            if (data.data[0][0].entity_name === entityName && entityName !== selectedEntity) {
              return `arcSlice +${data.data[3]}Arc`;
            }
            return 'arcSlice';
          });

        setSelectedEntity(entityName);
      } else {
        // add cluster to open pipelines array
        const entityType = d.data[2];
        if (openPipelines.includes(entityType)) {
          this.removeOpenPipeline(entityType);
        } else {
          this.addOpenPipeline(entityType);
        }
      }
    });

    chordLayer.selectAll('.arcSlice').on('mouseover', (d) => {
      const pageX = event.offsetX;
      const pageY = event.offsetY;

      this.hoverTimeout = setTimeout(() => {
        d3.selectAll('.popper-wrap').remove();
        appendTooltip(pageX, pageY);
        getTooltipData(d, 'cluster');
      }, 300);
    });

    chordLayer.selectAll('.arcSlice').on('mouseleave', () => {
      removeTooltip();
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    });
    return arcsCentroids;
  }

  addCloseArcIcons(svg, coordinatesObject, pipeline) {
    const iconsLayer = svg.select('.icons');

    const closeIcons = iconsLayer
      .append('svg:image')
      .attr('class', `icon icon__close icon-${pipeline} +close`)
      .attr('width', d3ItemsConfig.iconCloseWidth)
      .attr('height', d3ItemsConfig.iconCloseHeight)
      .attr('xlink:href', chordIcons.close)
      .attr('transform', () => `translate(${coordinatesObject.x},${coordinatesObject.y})`);

    closeIcons.exit().remove();

    closeIcons.on('click', () => {
      this.removeOpenPipeline(pipeline);
    });
  }

  addIcons(svg) {
    const { entities } = this.props;
    const { openPipelines } = this.state;

    const pieData = this.setArcsDistance(pie(entities));

    const iconsLayer = svg.select('.icons');
    const iconsGroupData = iconsLayer.selectAll('.icon')
      .data(pieData);

    // ENTER
    iconsGroupData.enter()
      .append('svg:image')
      .attr('class', d => `icon icon-${d.data[2]}`)
      .attr('width', d3ItemsConfig.iconWidth)
      .attr('height', d3ItemsConfig.iconHeight)
      .attr('xlink:href', d => getIconColor(d.data[2], d.data[3]))
      .attr('transform', (d) => {
        if (openPipelines.length > 0 && openPipelines.includes(d.data[2])) {
          const pipeline = d.data[2];
          const pipelineClusters = pieData.filter(clusters => clusters.data[2] === pipeline);

          this.addCloseArcIcons(svg, this.getIconPosition(pipelineClusters, true, true), pipeline);

          return `translate(${this.getIconPosition(pipelineClusters, true).x},${this.getIconPosition(pipelineClusters, true).y})`;
        }
        return `translate(${this.getIconPosition(d).x},${this.getIconPosition(d).y})`;
      })
      .on('mouseover', (d) => {
        const pageX = event.offsetX;
        const pageY = event.offsetY;

        // display tooltip
        this.hoverTimeout = setTimeout(() => {
          d3.selectAll('.popper-wrap').remove();
          appendTooltip(pageX, pageY);
          populateClusterTooltip(null, pipelineToName(d && d.data && d.data[2]));
        }, 300);
      })
      .on('mouseleave', () => {
        d3.selectAll('.popper-wrap').remove();
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      });

    // UPDATE
    iconsGroupData
      .attr('xlink:href', d => getIconColor(d.data[2], d.data[3]))
      .attr('transform', (d) => {
        if (openPipelines.length > 0 && openPipelines.includes(d.data[2])) {
          const pipeline = d.data[2];
          const pipelineClusters = pieData.filter(clusters => clusters.data[2] === pipeline);

          this.addCloseArcIcons(svg, this.getIconPosition(pipelineClusters, true, true), pipeline);

          return `translate(${this.getIconPosition(pipelineClusters, true).x},${this.getIconPosition(pipelineClusters, true).y})`;
        }
        return `translate(${this.getIconPosition(d).x},${this.getIconPosition(d).y})`;
      });

    iconsGroupData.exit().remove();
  }

  addFlows(svg, centroids) {
    const { relations } = this.props;

    const flowsData = augmentDataFlows(centroids, relations);

    const flowsLayer = svg.select('.flows');
    const flowsGroupData = flowsLayer.selectAll('.flow')
      .data(flowsData);

    // ENTER
    flowsGroupData.enter()
      .append('path')
      .attr('class', (d) => {
        const flowBehavior = getFlowBehavior(
          this.getEntityBehavior(d[0].start_ip),
          this.getEntityBehavior(d[3].end_ip),
        );
        return `flow +${flowBehavior}`;
      })
      .attr('d', flowLine);

    // UPDATE
    flowsGroupData
      .attr('class', (d) => {
        const flowBehavior = getFlowBehavior(
          this.getEntityBehavior(d[0].start_ip),
          this.getEntityBehavior(d[3].end_ip),
        );
        return `flow +${flowBehavior}`;
      })
      .attr('d', flowLine);

    // EXIT
    flowsGroupData.exit().remove();

    flowsLayer.selectAll('.flow').on('mouseover', (d) => {
      const pageX = event.offsetX;
      const pageY = event.offsetY;

      // display tooltip only for flows between 2 entities
      if (d[0].start_ip_type_occurrences === 1 && d[3].end_ip_type_occurrences === 1) {
        this.hoverTimeout = setTimeout(() => {
          d3.selectAll('.popper-wrap').remove();
          appendTooltip(pageX, pageY);
          getTooltipData(d, 'flows');
        }, 300);
      }
    });

    flowsLayer.selectAll('.flow').on('mouseleave', () => {
      removeTooltip();
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    });
  }

  injectD3(config) {
    const node = this.svgNode;

    const svgTag = d3.select(node)
      .attr('class', 'chord__svg');
    const svgChord = svgTag.select('.chord__group');
    svgChord.attr(
      'transform',
      `translate(${config.svgWidth / 2}, ${config.svgHeight / 2})`,
    );

    const arcsCentroids = this.addArcs(svgChord);
    this.addIcons(svgChord);
    this.addFlows(svgChord, arcsCentroids);
  }

  render() {
    const { config, style } = this.props;
    return (
      <div className="chord" style={style}>
        <svg ref={node => this.svgNode = node} width={config.svgWidth} height={config.svgHeight}>
          <g className="chord__group">
            <g className="flows" />
            <g className="chord" />
            <g className="icons" />
          </g>
        </svg>
      </div>
    );
  }
}

D3Chord.displayName = 'D3Chord';
D3Chord.propTypes = {
  'config': PropTypes.object,
  'entities': PropTypes.array,
  'relations': PropTypes.array,
  'selectedEntity': PropTypes.string,
  'style': PropTypes.object,
  'setSelectedEntity': PropTypes.func,
};
D3Chord.defaultProps = {
  'config': {},
  'entities': [],
  'relations': [],
  'selectedEntity': '',
  'style': {},
  'setSelectedEntity': () => null,
};
