import { Routes } from "@angular/router";
import { ClientsResolver } from "./core/services/userlist-resolver.service";
import { AuthGuard } from "./core/guards/auth.guard";
import { NonAuthGuard } from "./core/guards/nonAuth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "clients-list",
    pathMatch: "full",
  },
  {
    path: "clients-list",
    loadComponent: () =>
      import("./components/clients-list/clients-list.component").then(
        (c) => c.ClientsListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "client-details/:id",
    loadComponent: () =>
      import("./components/clients-details/clients-details.component").then(
        (c) => c.ClientsDetailsComponent
      ),
    resolve: {
      userDetail: ClientsResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "client-form",
    loadComponent: () =>
      import("./components/client-form/client-form.component").then(
        (c) => c.ClientFormComponent
      ),
    resolve: {
      userDetail: ClientsResolver,
    },
    canActivate: [AuthGuard],
  },
  {
    path: "log-in",
    loadComponent: () =>
      import("./components/log-in/log-in.component").then(
        (c) => c.LogInComponent
      ),
    canActivate: [NonAuthGuard],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./components/not-found/not-found.component").then(
        (c) => c.NotFoundComponent
      ),
  },
];
