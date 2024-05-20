import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, ButtonModule, NgIf],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public showButton: boolean = true;
  constructor(private router: Router, private chd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.showButton = route.url.includes("clients-list");
        this.chd.markForCheck();
      }
    });
  }

  logOut() {
    localStorage.removeItem("user");
    this.router.navigate(["/log-in"]);
  }
}
