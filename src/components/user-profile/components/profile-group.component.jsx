import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

const ProfileGroup = (props) => {
  const { items, type, privileges } = props;
  if (type === 'protected') {
    return (
      <div className="profileBox__group">
        {
          items.map((el) => {
            const workaround = el.label === 'Tactics' ? 'Tags' : el.label;
            if (privileges[workaround] && privileges[workaround].read) {
              if (el.url) {
                return (
                  <Link
                    key={el.id}
                    className="profileBox__item +protected"
                    to={el.url}
                    onClick={props.onClose}
                  >
                    { el.icon && <span className={el.icon} /> }
                    {
                      el.label && (
                        <span className={`${el.label}__label`}>{el.label}</span>
                      )
                    }
                  </Link>
                );
              }
              return (
                <span
                  key={el.id}
                  className="profileBox__item +protected"
                  onClick={() => props.onClick(el.id)}
                >
                  <span className={el.icon} />
                  {el.label}
                </span>
              );
            }
            return null;
          })
        }
      </div>
    );
  }

  return (
    <div className="profileBox__group">
      {
        items.map(el => (
          <span
            key={el.id}
            className="profileBox__item"
            onClick={() => props.onClick(el.id)}
          >
            {el.label}
          </span>
        ))
      }
    </div>
  );
};
ProfileGroup.displayName = 'ProfileGroup';
ProfileGroup.propTypes = {
  'items': PropTypes.array,
  'privileges': PropTypes.object.isRequired,
  'type': PropTypes.string,
};
ProfileGroup.defaultProps = {
  'items': [],
  'type': '',
  'onClick': () => null,
};

export default ProfileGroup;
