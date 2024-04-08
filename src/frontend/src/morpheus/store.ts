import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/infrastructure/store';
import projectReducer from './modflow/infrastructure/store';

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type IRootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
