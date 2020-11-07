import { createStore } from "redux"
import {
  createActionCreators,
  createReducerFunction,
  ImmerReducer,
} from "immer-reducer"

export interface IBlogState {
  animation: boolean;
}

// State Init
const BlogState : IBlogState = {
   animation: true
};

// immer-Reducer
class BlogReducer extends ImmerReducer<IBlogState> {
  toggleAnimation(toggle : boolean) {
      this.draftState.animation = toggle;
  }
}


// Export (Store) and (Function for Dispatch)
export const BlogActions = createActionCreators(BlogReducer);

const blogReducer = createReducerFunction(BlogReducer, BlogState);
export const store = createStore(blogReducer);
