import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { accountModel, UserInterface } from "../../../core/interface/interface";
import { ButtonModule } from "primeng/button";
import { JsonPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupModule } from "primeng/inputgroup";
import { InputTextModule } from "primeng/inputtext";
import { mainService } from "../../../core/services/main-service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { v4 as uuidv4 } from "uuid";
import { Subject, debounceTime, takeUntil } from "rxjs";
import { CustomValidators } from "../../../core/validators/validate";

@Component({
  selector: "app-account-model",
  standalone: true,
  imports: [
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    NgIf,
    NgFor,
    DropdownModule,
    MultiSelectModule,
    JsonPipe,
  ],
  templateUrl: "./account-model.component.html",
  styleUrl: "../clients-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class AccountModelComponent {
  public showForm: boolean = false;
  @Input({ required: true }) userData: UserInterface;
  sub$: Subject<void> = new Subject<void>();

  accountTypes = [
    { name: "მიმდინარე" },
    { name: "შემნახველი" },
    { name: "დაგროვებითი" },
  ];
  accountStatus = [{ name: "აქტიური" }, { name: "დახურული" }];
  currencyTypes = [{ name: "GEO" }, { name: "USD" }, { name: "EUR" }];

  clientForm: FormGroup;
  constructor(
    private mainservice: mainService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.clientForm = new FormGroup({
      id: new FormControl(""),
      accountNumber: new FormControl("", [
        Validators.required,
        CustomValidators.accountNumberExists(this.userData.accountModel),
      ]),
      clientNumber: new FormControl(""),
      accountType: new FormControl("", Validators.required),
      accountStatus: new FormControl("", Validators.required),
      currency: new FormControl("", Validators.required),
    });
  }

  onSubmit() {
    const uniqueId = uuidv4();
    this.clientForm.controls.id.setValue(uniqueId);
    this.clientForm.controls.clientNumber.setValue(uniqueId + "1");
    this.userData.accountModel.push(this.clientForm.getRawValue());
    const payload = this.userData;
    this.mainservice
      .updateUser(this.userData.id, payload)
      .pipe(takeUntil(this.sub$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: "success",
            detail: "ანგარიშის მოდელი წარმატებით დაემატა",
          });
          this.clientForm.reset();
          this.toggleForm();
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            detail: `${error.error}`,
          });
        }
      );
  }

  closeModel(id: string | number) {
    this.userData.accountModel.find((item) => {
      if (item.id === id) {
        item.accountType.name = "დახურული";
      }
    });
    this.mainservice
      .updateUser(this.userData.id, this.userData)
      .pipe(takeUntil(this.sub$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: "success",
            detail: "ანგარიშის მოდელი წარმატებით დაიხურა",
          });
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            detail: `${error.error}`,
          });
        }
      );
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
