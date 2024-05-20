import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { switchMap, map, catchError, tap, filter } from "rxjs/operators";
import { of } from "rxjs";
import * as UserActions from "./auth.action";
import { User } from "../interface/interface";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.checkUserExistence),
      switchMap(({ personalId, password }) =>
        this.http.get<User>(`/user?personalId=${personalId}`).pipe(
          map((user) => {
            if (
              user &&
              user.personalId === personalId &&
              user.password === password
            ) {
              this.router.navigate(["/clients-list"]);
              return UserActions.loginSuccess({ user });
            } else {
              return UserActions.loginFailure({
                error: "მომხმარებელი ვერ მოიძებნა",
              });
            }
          }),
          catchError((error) => {
            return of(UserActions.loginFailure({ error: "API call failed" }));
          })
        )
      )
    )
  );

  saveUserToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(({ user }) => {
          localStorage.setItem("user", JSON.stringify(user));
        })
      ),
    { dispatch: false }
  );
}
