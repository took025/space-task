import { Routes } from "@angular/router";
import { ClientsResolver } from "./core/services/userlist-resolver.service";

export const routes: Routes = [
  {
    path: "clients-list",
    loadComponent: () =>
      import("./components/clients-list/clients-list.component").then(
        (c) => c.ClientsListComponent
      ),
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
  },
  {
    path: "",
    redirectTo: "clients-list",
    pathMatch: "full",
  },
];
