import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NonAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem("user");
    console.log(user);

    if (!user) {
      return true;
    } else {
      this.router.navigate(["/clients-list"]);
      return false;
    }
  }
}
