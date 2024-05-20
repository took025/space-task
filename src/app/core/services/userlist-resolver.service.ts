import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserInterface } from "../../core/interface/interface";
import { mainService } from "./main-service";

@Injectable({
  providedIn: "root",
})
export class ClientsResolver implements Resolve<UserInterface> {
  constructor(private mainService: mainService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserInterface> {
    var id: number | string;
    if (route.url[0].path === "client-details") {
      id = route.paramMap.get("id");
    } else {
      id = route.queryParamMap.get("id");
    }

    if (!id) {
      return null;
    }
    return this.mainService.getUserDetail(id);
  }
}
