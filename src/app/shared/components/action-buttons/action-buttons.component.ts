import { NgClass } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
@Component({
  selector: "app-action-buttons",
  standalone: true,
  imports: [ButtonModule, NgClass, RouterLink],
  templateUrl: "./action-buttons.component.html",
  styleUrl: "./action-buttons.component.scss",
})
export class ActionButtonsComponent {
  @Input({ required: true }) userId: string;
  @Output() onDeleteUser: EventEmitter<any> = new EventEmitter();

  public dropDown: boolean = false;
  constructor(private elementRef: ElementRef) {}

  toggleDropdown(): void {
    this.dropDown = !this.dropDown;
  }

  deleteUser(): void {
    this.onDeleteUser.emit(this.userId);
  }

  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropDown = false;
    }
  }
}
