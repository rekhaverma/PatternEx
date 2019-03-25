import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

const ExtraDetailsList = props => (
  <div className={`${props.className}__list`}>
    <div className={`${props.className}__list--title`}>
      {
        props.titles.map(title => <div key={title} className={`${props.className}__list--title-item`}><p>{title}</p></div>)
      }
    </div>
    <div className={`${props.className}__list--content`}>
      <Scrollbars
        autoHeight
        hideTracksWhenNotNeeded
        autoHeightMax={270}
        renderThumbVertical={subProps => <div {...subProps} style={{ 'backgroundColor': '#1b1b1b', 'borderRadius': '3px' }} className="thumb-vertical" />}
      >
        {
          props.listContent.map((item, index) => (
            <div key={index} className={`${props.className}__list--list-content`}>
              <div className={`${props.className}__list--list-content-item`}>
                <p>{item.tactic}</p>
              </div>
              <div className={`${props.className}__list--list-content-item`}>
                {
                  item.technique.map((tech, techIndex) => <p key={techIndex}>{tech}</p>)
                }
              </div>
            </div>
          ))
        }
      </Scrollbars>
    </div>
  </div>
);

ExtraDetailsList.propTypes = {
  className: PropTypes.string,
  titles: PropTypes.array,
  listContent: PropTypes.array,
};

ExtraDetailsList.defaultProps = {
  className: '',
  titles: [],
  listContent: [],
};

export default ExtraDetailsList;

