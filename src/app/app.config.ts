import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { DefaultHttpInterceptor } from "./core/interceptors/interceptor";
import { metaReducers, reducers } from "./core/state";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { UserEffects } from "./core/state/auth.effect";

import { provideEffects } from "@ngrx/effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultHttpInterceptor,
      multi: true,
    },
    provideStore(reducers, { metaReducers }),
    // EffectsModule.forRoot([UserEffects]),
    provideEffects([UserEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
