import { connect } from 'react-redux';
import Notification from 'components/notification';
import { removeNotification } from 'model/actions';

/**
 * @todo: refactor this container and remove the notifications from components
 * @param dispatch
 * @returns {{remove: remove}}
 */
const mapDispatchToProps = dispatch => ({
  'remove': (id) => { dispatch(removeNotification(id)); },
});

export default connect(null, mapDispatchToProps)(Notification);
