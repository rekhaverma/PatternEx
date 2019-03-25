import { locationBackUrl } from 'lib';
import { getEvpUrlHandler, handleOldExplodedView } from 'model/actions/exploded-view';

export default class EvpOpenMethods {
  static onRowClickHandler(row, behaviorType, isOldEVPActive, handleExplodedView) {
    if (isOldEVPActive) {
      handleOldExplodedView(row, behaviorType);
    } else {
      locationBackUrl.setBackUrl('/exploded-view');
      handleExplodedView(getEvpUrlHandler(row, behaviorType));
    }
  }

  static onInspectHandler(row, behaviorType, isOldEVPActive) {
    if (isOldEVPActive) {
      handleOldExplodedView(row, behaviorType);
    }
  }

  static getNewTabUrlHandler(row, behaviorType, isOldEVPActive) {
    if (isOldEVPActive) {
      return false;
    }

    return getEvpUrlHandler(row, behaviorType);
  }
}
