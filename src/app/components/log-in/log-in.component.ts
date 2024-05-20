import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Store } from "@ngrx/store";
import { checkUserExistence } from "../../core/state/auth.action";
import { Router } from "@angular/router";
import { AuthState } from "../../core/state/auth.reducer";
import {
  selectAuthError,
  selectAuthState,
} from "../../core/state/auth.selector";
import { AsyncPipe, NgClass, NgIf } from "@angular/common";
import { Observable, Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    AsyncPipe,
    NgClass,
  ],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.scss",
})
export class LogInComponent {
  loginForm: FormGroup;
  errorMessage$: Observable<string>;
  sub$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AuthState>,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      personalId: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      password: ["", Validators.required],
    });
    this.errorMessage$ = this.store.select(selectAuthError);
  }

  logIn() {
    if (this.loginForm.valid) {
      const { personalId, password } = this.loginForm.value;
      this.store.dispatch(checkUserExistence({ personalId, password }));
      this.store
        .select(selectAuthState)
        .pipe(takeUntil(this.sub$))
        .subscribe((state) => {
          if (state.user) {
            this.router.navigate(["/clients-list"]);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
