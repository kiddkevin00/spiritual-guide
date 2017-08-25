import actionTypes from '../actiontypes/';


const initialState = {
  waitingForAsyncOps: true,
};

function landingReducer(state = initialState, action) {
  const actionType = action.type;
  const actionData = action.data;

  switch (actionType) {
    case actionTypes.LANDING.FINISH_WAITING_FOR_ASYNC_OPS:
      return Object.assign({}, state, {
        waitingForAsyncOps: false,
      });
    default:
      return state;
  }
}

export { landingReducer as default };
