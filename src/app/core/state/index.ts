import { isDevMode } from "@angular/core";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { userReducer } from "./auth.reducer";

export interface State {}

export const reducers: ActionReducerMap<State> = {
  login: userReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
