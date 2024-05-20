import { ChangeDetectionStrategy, Component } from "@angular/core";
import { mainService } from "../../core/services/main-service";
import { UserInterface } from "../../core/interface/interface";
import { JsonPipe } from "@angular/common";
import { FieldsetModule } from "primeng/fieldset";
import { ActivatedRoute } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { Subject, takeUntil } from "rxjs";
import { AccountModelComponent } from "./account-model/account-model.component";
import { ButtonModule } from "primeng/button";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-clients-details",
  standalone: true,
  imports: [
    JsonPipe,
    FieldsetModule,
    AvatarModule,
    AccountModelComponent,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: "./clients-details.component.html",
  styleUrl: "./clients-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class ClientsDetailsComponent {
  sub$: Subject<void> = new Subject<void>();
  public clientData: UserInterface;

  constructor(
    private mainService: mainService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.sub$)).subscribe(
      ({ userDetail }) => {
        this.clientData = userDetail;
        setTimeout(() => {
          this.messageService.add({
            severity: "success",
            detail: "ინფომრმაცია წარმატებით ჩაიტვირთა",
          });
        }, 0);
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          detail: `${error.error}`,
        });
      }
    );
  }

  getData(id: number | string) {
    this.mainService
      .getUserDetail(id)
      .pipe(takeUntil(this.sub$))
      .subscribe(
        (res: UserInterface) => {
          this.clientData = res;
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            detail: `${error.error}`,
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
