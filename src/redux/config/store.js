import { configureStore } from '@reduxjs/toolkit';
import commentReducer from '../slices/commentSlice';
import logReducer from '../slices/logSlice';
import modalReducer from '../slices/modalSlice';
import postReducer from '../slices/postSlice';
import userReducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    post: postReducer,
    user: userReducer,
    log: logReducer,
    modal: modalReducer,
    comment: commentReducer
  }
});

export default store;
