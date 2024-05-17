import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { debounceTime, delay, map, Observable, share, Subject } from "rxjs";
import { apiData, userInterface } from "../interface/interface";
@Injectable({
  providedIn: "root",
})
export class mainService {
  constructor(private http: HttpClient) {}

  getData(page: number, limit: number): Observable<apiData> {
    return this.http
      .get<apiData>(`?_page=${page}&_per_page=${limit}`)
      .pipe(share());
  }

  deleteUser(id: number | string) {
    return this.http.delete(`/${id}`).pipe(share());
  }

  getUserDetail(id: number | string): Observable<userInterface> {
    return this.http.get<userInterface>(`/${id}`).pipe(share());
  }

  updateUser(
    id: number | string,
    payload: userInterface
  ): Observable<userInterface> {
    const url = `/${id}`;
    console.log(`Making PUT request to: ${url} with payload:`, payload);
    return this.http.put<userInterface>(`/${id}`, payload).pipe(share());
  }

  postNewAccount(payload: userInterface): Observable<userInterface> {
    return this.http.post<userInterface>(``, payload).pipe(share());
  }
}
