import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { accountModel } from "../interface/interface";

export class CustomValidators {
  static validText(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (value?.length < 2 || value?.length > 50) {
        return { invalidLength: true };
      }

      const englishPattern = /^[a-zA-Z]+$/;
      const georgianPattern = /^[ა-ჰ]+$/;

      if (/[a-zA-Z]/.test(value) && /[ა-ჰ]/.test(value)) {
        return { mixedLanguages: true };
      }

      if (!englishPattern.test(value) && !georgianPattern.test(value)) {
        return { invalidCharacters: true };
      }
      return null;
    };
  }
  static validPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      const phoneNumberPattern = /^5\d{8}$/;

      if (!phoneNumberPattern.test(value)) {
        return { invalidPhoneNumber: true };
      }

      return null;
    };
  }
  static accountNumberExists(accountModel: accountModel[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validation error if the control is empty
      }
      const exists = accountModel.some((item) => item.id === control.value);
      return exists ? { accountNumberExists: true } : null;
    };
  }
}
