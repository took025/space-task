import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>("login");

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
