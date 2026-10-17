// store.js
import { createStore } from 'redux';

const initialState = {
  episodeId: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EPISODE_ID':
      return { ...state, episodeId: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
