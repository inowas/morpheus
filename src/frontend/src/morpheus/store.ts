import {configureStore} from '@reduxjs/toolkit';
import authenticationReducer from './authentication/infrastructure/store';
import userReducer from './user/infrastructure/store';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
