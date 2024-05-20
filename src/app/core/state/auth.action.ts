// import { createAction, props } from "@ngrx/store";

// export const login = createAction(
//   "[Login Page] Login",
//   props<{ personalId: string; password: string }>()
// );

// export const loginSuccess = createAction(
//   "[Login API] Login Success",
//   props<{ user: any }>()
// );

// export const loginFailure = createAction(
//   "[Login API] Login Failure",
//   props<{ error: any }>()
// );

import { createAction, props } from "@ngrx/store";
import { User } from "../interface/interface";

export const checkUserExistence = createAction(
  "[Login Page] Check User Existence",
  props<{ personalId: string; password: string }>()
);

export const loginSuccess = createAction(
  "[Login API] Login Success",
  props<{ user: User }>()
);

export const loginFailure = createAction(
  "[Login API] Login Failure",
  props<{ error: any }>()
);
