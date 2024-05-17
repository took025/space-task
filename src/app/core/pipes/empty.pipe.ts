import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "empty",
  standalone: true,
})
export class EmptyPipe implements PipeTransform {
  transform(value: string | number): string | number {
    if (value === null || value === undefined || value === "") {
      return "---";
    }
    return value;
  }
}
