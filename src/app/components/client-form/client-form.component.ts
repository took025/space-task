import { NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { userInterface } from "../../core/interface/interface";
import { mainService } from "../../core/services/main-service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { CustomValidators } from "../../core/validators/validate";

@Component({
  selector: "app-client-form",
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    NgClass,
    ButtonModule,
    RadioButtonModule,
    ToastModule,
  ],
  templateUrl: "./client-form.component.html",
  styleUrl: "./client-form.component.scss",
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormComponent {
  userForm: FormGroup;
  sub$: Subject<void> = new Subject<void>();
  public clientData: userInterface;
  public Editmode =
    this.route.snapshot.queryParamMap.get("mode") === "edit" ? true : false;
  public imageUrl: string | ArrayBuffer | null = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mainService: mainService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      accountModel: [""],
      name: ["", [Validators.required, CustomValidators.validText()]],
      surname: ["", [Validators.required, CustomValidators.validText()]],
      gender: ["", Validators.required],
      phoneNumber: [
        "",
        [Validators.required, CustomValidators.validPhoneNumber()],
      ],
      image: ["", Validators.required],
      personalId: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
      ],
      factualAdress: this.fb.group({
        country: ["", Validators.required],
        city: ["", Validators.required],
        address: ["", [Validators.required]],
      }),
      LegalAddress: this.fb.group({
        country: ["", Validators.required],
        city: ["", Validators.required],
        address: ["", [Validators.required]],
      }),
    });
    if (this.Editmode) {
      this.getData();
      this.userForm.patchValue(this.clientData);
    }
  }

  getData() {
    this.route.data.pipe(takeUntil(this.sub$)).subscribe(({ userDetail }) => {
      this.clientData = userDetail;
      this.imageUrl = userDetail.image;
      setTimeout(() => {
        this.messageService.add({
          severity: "success",
          detail: "ინფომრმაცია წარმატებით ჩაიტვირთა",
        });
      }, 0);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.userForm.controls.image.setValue(reader.result);
        this.messageService.add({
          severity: "success",
          detail: "სურათი წარმატებით აიიტვირთა",
        });
      };
    } else {
      this.messageService.add({
        severity: "warn",
        detail: "გთხოვთ ატვირთოთ  მხოლოდ სურათი",
      });
    }
  }

  onSubmit() {
    if (this.Editmode) {
      const newdata = { ...this.clientData, ...this.userForm.getRawValue() };
      this.mainService
        .updateUser(this.clientData.id, newdata)
        .pipe(takeUntil(this.sub$))
        .subscribe(() => {
          this.messageService.add({
            severity: "success",
            detail: "ინფორმაცია წარმატებით შეიცვალა",
          });
        });
    } else {
      this.userForm.controls.accountModel.setValue([]);
      const payload = this.userForm.getRawValue();
      this.mainService
        .postNewAccount(payload)
        .pipe(takeUntil(this.sub$))
        .subscribe(() => {
          this.messageService.add({
            severity: "success",
            detail: "მომხმარებელი წარმატებით დარეგისტრირდა",
          });
          this.userForm.reset();
          this.imageUrl = null;
        });
    }
  }

  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
