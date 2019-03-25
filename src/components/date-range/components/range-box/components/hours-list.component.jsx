import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './hours-list.style.scss';

const ListItem = ({ label, value, selected, cb, active, allowEnableDatesHours }) => {
  let hourClass = '';
  if (allowEnableDatesHours) {
    if (active) {
      hourClass = '+active';
    } else {
      hourClass = '+inactive';
    }
  }
  return (
    <li
      className={`${selected === value ? '+selected ' : ''} ${hourClass}`}
      onClick={() => { cb(value); }}
    >
      {label}
    </li>);
};

ListItem.propTypes = {
  'label': PropTypes.string.isRequired,
  'value': PropTypes.number.isRequired,
  'selected': PropTypes.number.isRequired,
  'cb': PropTypes.func.isRequired,
  'active': PropTypes.bool.isRequired,
  'allowEnableDatesHours': PropTypes.bool.isRequired,
};

class HoursList extends PureComponent {
  constructor(props) {
    super(props);

    this.onArrowClick = this.onArrowClick.bind(this);
    this.state = {
      'transitionAmount': 0,
    };
  }

  onArrowClick(type) {
    const newAmount = (this.listElement.offsetHeight / 2) - 30;
    let { transitionAmount } = this.state;

    if (type === 'up' && transitionAmount < 0) {
      transitionAmount += newAmount;
    }

    if (type === 'down' && transitionAmount > -newAmount) {
      transitionAmount -= newAmount;
    }

    this.setState({
      transitionAmount,
    });
  }

  render() {
    const { list, enableHours, allowEnableDatesHours } = this.props;
    const { transitionAmount } = this.state;
    const style = {
      'transform': `translateY(${transitionAmount}px`,
    };

    return (
      <div
        className="hours__wrapper"
        ref={(ref) => { this.wrapperElement = ref; }}
      >
        <span
          className="hours__arrow icon-chevron-up"
          onClick={() => { this.onArrowClick('up'); }}
        />
        <div className="hours__list-wrapper">
          <ul
            className="hours__list"
            style={style}
            ref={(ref) => { this.listElement = ref; }}
          >
            {list.map((item, i) => (
              <ListItem
                key={`${item.label}-${i}`}
                label={item.label}
                value={item.value}
                selected={this.props.selectedHour ? this.props.selectedHour : 0}
                cb={this.props.onSelectHour}
                active={enableHours.indexOf(item.value) > -1}
                allowEnableDatesHours={allowEnableDatesHours}
              />
            ))}
          </ul>
        </div>
        <span
          className="hours__arrow icon-chevron-down"
          onClick={() => { this.onArrowClick('down'); }}
        />
      </div>
    );
  }
}

HoursList.displayName = 'HoursList';

HoursList.propTypes = {
  'onSelectHour': PropTypes.func.isRequired,
  'selectedHour': PropTypes.number,
  'list': PropTypes.array,
  'enableHours': PropTypes.array,
  'allowEnableDatesHours': PropTypes.bool,
};

HoursList.defaultProps = {
  'allowEnableDatesHours': false,
  'enableHours': [],
  'selectedHour': null,
  'list': [
    {
      'value': 0,
      'label': '00:00',
    },
    {
      'value': 1,
      'label': '01:00',
    },
    {
      'value': 2,
      'label': '02:00',
    },
    {
      'value': 3,
      'label': '03:00',
    },
    {
      'value': 4,
      'label': '04:00',
    },
    {
      'value': 5,
      'label': '05:00',
    },
    {
      'value': 6,
      'label': '06:00',
    },
    {
      'value': 7,
      'label': '07:00',
    },
    {
      'value': 8,
      'label': '08:00',
    },
    {
      'value': 9,
      'label': '09:00',
    },
    {
      'value': 10,
      'label': '10:00',
    },
    {
      'value': 11,
      'label': '11:00',
    },
    {
      'value': 12,
      'label': '12:00',
    },
    {
      'value': 13,
      'label': '13:00',
    },
    {
      'value': 14,
      'label': '14:00',
    },
    {
      'value': 15,
      'label': '15:00',
    },
    {
      'value': 16,
      'label': '16:00',
    },
    {
      'value': 17,
      'label': '17:00',
    },
    {
      'value': 18,
      'label': '18:00',
    },
    {
      'value': 19,
      'label': '19:00',
    },
    {
      'value': 20,
      'label': '20:00',
    },
    {
      'value': 21,
      'label': '21:00',
    },
    {
      'value': 22,
      'label': '22:00',
    },
    {
      'value': 23,
      'label': '23:00',
    },
    {
      'value': 24,
      'label': '24:00',
    },
  ],
};

export default HoursList;
