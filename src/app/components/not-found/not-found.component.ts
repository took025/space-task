import { Component } from "@angular/core";
import { Message } from "primeng/api";
import { MessagesModule } from "primeng/messages";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [MessagesModule],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent {
  errorText: Message[] | undefined = [
    { severity: "error", summary: "არასწორი გევრდი" },
  ];
}
