import xor from 'lodash/array/xor';
import intersection from 'lodash/array/intersection';
import { BEGIN_DRAG, PUBLISH_DRAG_SOURCE, HOVER, END_DRAG, DROP } from '../actions/dragDrop';
import { ADD_SOURCE, ADD_TARGET, REMOVE_SOURCE, REMOVE_TARGET } from '../actions/registry';

const NONE = [];
const ALL = [];

export default function dirtyHandlerIds(state = NONE, action, dragOperation) {
  switch (action.type) {
  case HOVER:
    break;
  case REMOVE_TARGET:
    return NONE;
  case ADD_SOURCE:
  case ADD_TARGET:
  case REMOVE_SOURCE:
    return state;
  case BEGIN_DRAG:
  case PUBLISH_DRAG_SOURCE:
  case END_DRAG:
  case DROP:
  default:
    return ALL;
  }

  const { targetIds } = action;
  const { targetIds: prevTargetIds } = dragOperation;
  const dirtyHandlerIds = xor(targetIds, prevTargetIds);

  let didChange = false;
  if (dirtyHandlerIds.length === 0) {
    for (let i = 0; i < targetIds.length; i++) {
      if (targetIds[i] !== prevTargetIds[i]) {
        didChange = true;
        break;
      }
    }
  } else {
    didChange = true;
  }

  if (!didChange) {
    return NONE;
  }

  const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  const innermostTargetId = targetIds[targetIds.length - 1];

  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      dirtyHandlerIds.push(prevInnermostTargetId);
    }
    if (innermostTargetId) {
      dirtyHandlerIds.push(innermostTargetId);
    }
  }

  return dirtyHandlerIds;
}

export function areDirty(state, handlerIds) {
  if (state === NONE) {
    return false;
  }

  if (state === ALL || typeof handlerIds === 'undefined') {
    return true;
  }

  return intersection(handlerIds, state).length > 0;
}
