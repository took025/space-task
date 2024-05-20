import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  share,
  Subject,
} from "rxjs";
import { ApiData, UserInterface } from "../interface/interface";
@Injectable({
  providedIn: "root",
})
export class mainService {
  constructor(private http: HttpClient) {}

  getUserData(page: number, limit: number, payload: any): Observable<ApiData> {
    let params = new HttpParams();
    let optionalMark: string = "";
    for (let key in payload) {
      if (payload[key]) {
        params = params.set(key, payload[key]);
        optionalMark = "&";
      }
    }
    return this.http
      .get<ApiData>(`?_page=${page}&_per_page=${limit}${optionalMark}${params}`)
      .pipe(share());
  }

  deleteUser(id: number | string) {
    return this.http.delete(`/${id}`).pipe(share());
  }

  getUserDetail(id: number | string): Observable<UserInterface> {
    return this.http.get<UserInterface>(`/${id}`).pipe(share());
  }

  updateUser(
    id: number | string,
    payload: UserInterface
  ): Observable<UserInterface> {
    const url = `/${id}`;
    return this.http.put<UserInterface>(`/${id}`, payload).pipe(share());
  }

  postNewAccount(payload: UserInterface): Observable<UserInterface> {
    return this.http.post<UserInterface>(``, payload).pipe(share());
  }
  simpleSearch(payload: UserInterface): Observable<UserInterface[]> {
    let params = new HttpParams();
    for (let key in payload) {
      if (payload[key]) {
        params = params.set(key, payload[key]);
      }
    }
    console.log(params);

    return this.http.get<UserInterface[]>(``, { params });
  }

  advancedSearch(filters: any): Observable<UserInterface[]> {
    let params = new HttpParams();
    for (let key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http
      .get<UserInterface[]>(``, { params })
      .pipe(distinctUntilChanged());
  }
}
