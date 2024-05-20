import { createReducer, on } from "@ngrx/store";
import * as UserActions from "./auth.action";
import { User } from "../interface/interface";

export const initialState = {
  user: null,
  error: null,
};

export interface AuthState {
  user: User;
  error: any;
}

const _userReducer = createReducer(
  initialState,
  on(UserActions.loginSuccess, (state, { user }) => ({
    ...state,
    user: user,
    error: null,
  })),
  on(UserActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    error,
  }))
);

export function userReducer(state, action) {
  return _userReducer(state, action);
}
