import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import { filter, tap, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DefaultHttpInterceptor implements HttpInterceptor {
  private activeCalls: Map<string, Subject<HttpEvent<any>>> = new Map();

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      url: this.buildUrl(request.url),
    });

    if (this.activeCalls.has(modifiedRequest.url)) {
      return this.activeCalls.get(modifiedRequest.url).asObservable();
    }

    const subject = new Subject<HttpEvent<any>>();
    this.activeCalls.set(modifiedRequest.url, subject);

    return next.handle(modifiedRequest).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          subject.next(event);
          subject.complete();
          this.activeCalls.delete(modifiedRequest.url);
        }
      }),
      switchMap((event) => of(event))
    );
  }

  private buildUrl(url: string): string {
    return `http://localhost:3000/user-list${
      url.startsWith("/") ? "" : "/"
    }${url}`;
  }
}
