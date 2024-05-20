import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-client-filter",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    SkeletonModule,
    SelectButtonModule,
    ButtonModule,
  ],
  templateUrl: "./client-filter.component.html",
  styleUrl: "./client-filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFilterComponent {
  unsubscribe$: Subject<void> = new Subject();
  stateOptions: any[] = [
    { label: "მარტივი ფილტრი", value: "simple" },
    { label: "დეტალური ფილტრი", value: "detailed" },
  ];
  form: FormGroup;
  simpleSearchForm: FormGroup;
  advancedSearchForm: FormGroup;
  @Output() formValues = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private activRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.formsCreation();

    this.form.controls.selectedOption.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        localStorage.setItem("searchType", val);
      });
    if (localStorage.getItem("searchType")) {
      this.form.controls.selectedOption.setValue(
        localStorage.getItem("searchType")
      );
    } else {
      localStorage.setItem("searchType", "detailed");
    }

    this.activRouter.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        const querys = {
          name: params?.name,
          surname: params?.surname,
          gender: params?.gender,
          personalId: params?.personalId,
          phoneNumber: params?.phoneNumber,
        };
        if (querys) {
          if (this.form.controls.selectedOption.value === "simple") {
            this.simpleSearchForm.controls.query.setValue(params.name);
          } else {
            this.advancedSearchForm.patchValue(querys);
          }
        } else {
          this.advancedSearchForm.reset();
        }
      });
    this.emitFormValues();
  }

  emitFormValues() {
    let payload = this.advancedSearchForm.getRawValue();
    if (this.form.controls.selectedOption.value === "simple") {
      const query = this.simpleSearchForm.get("query")?.value;
      payload = {
        name: query,
        surname: query,
        gender: query,
        personalId: query,
        phoneNumber: query,
      };
    }
    this.formValues.emit(payload);
  }

  formsCreation() {
    this.form = this.fb.group({
      selectedOption: ["detailed"],
    });

    this.simpleSearchForm = this.fb.group({
      query: [""],
    });

    this.advancedSearchForm = this.fb.group({
      name: [""],
      surname: [""],
      gender: [""],
      personalId: [""],
      phoneNumber: [""],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
