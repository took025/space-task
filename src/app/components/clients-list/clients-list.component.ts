import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { mainService } from "../../core/services/main-service";
import { ApiData } from "../../core/interface/interface";
import { ActionButtonsComponent } from "../../shared/components/action-buttons/action-buttons.component";
import { Paginator, PaginatorModule } from "primeng/paginator";
import { Message, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { MessagesModule } from "primeng/messages";
import { Subject, takeUntil } from "rxjs";
import { EmptyPipe } from "../../core/pipes/empty.pipe";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { ClientFilterComponent } from "./client-filter/client-filter.component";

@Component({
  selector: "app-clients-list",
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule,
    RouterOutlet,
    ClientFilterComponent,
    TableModule,
    ActionButtonsComponent,
    PaginatorModule,
    ToastModule,
    MessagesModule,
    EmptyPipe,
  ],
  templateUrl: "./clients-list.component.html",
  styleUrl: "./clients-list.component.scss",
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsListComponent {
  @ViewChild("paginator", { static: true }) paginator: Paginator;
  unsubscribe$: Subject<void> = new Subject();
  userList: ApiData;
  public pagination = {
    page: 1,
    limit: 10,
  };
  first: number;
  errorText: Message[] | undefined = [{ severity: "error", summary: null }];
  loader: boolean = false;
  queryObjects = {};

  constructor(
    private mainService: mainService,
    private activRouter: ActivatedRoute,
    private router: Router,
    private chd: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  handleFormValue(e: Event) {
    this.queryObjects = e;
    this.listenQueryParamsChanges();
  }

  getData(text?: string) {
    this.loader = true;
    this.mainService
      .getUserData(
        this.pagination.page,
        this.pagination.limit,
        // this.advancedSearchForm.getRawValue()
        this.queryObjects
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: ApiData) => {
          this.userList = res;
          this.chd.markForCheck();
          setTimeout(() => {
            this.loader = false;
            this.messageService.add({
              severity: "success",
              detail: text ? text : "ინფომრმაცია წარმატებით ჩაიტვირთა",
            });
          }, 0);
        },
        (error) => {
          if (typeof error.error !== "string") {
            this.errorText[0].summary = `Check if Json-server is started and use command 'json-server --watch db.json'`;
          } else {
            this.errorText[0].summary = `User list Data ${error.error}`;
          }
          this.chd.markForCheck();
        }
      );
  }

  listenQueryParamsChanges(pagination?) {
    let payload = {
      ...this.pagination,
      ...this.queryObjects,
    };
    if (pagination) {
      this.changeQueryParams(payload);
      return;
    }
    this.activRouter.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((queryParams) => {
        console.log(queryParams);

        if (queryParams?.page && queryParams?.limit) {
          this.pagination = {
            page: queryParams.page,
            limit: queryParams.limit,
          };
        }
        // const event = {
        //   page: queryParams.page,
        //   rows: queryParams.limit,
        // };

        payload = { ...this.pagination, ...this.queryObjects };
        this.first = (queryParams?.page - 1) * queryParams?.limit;
      });

    this.changeQueryParams(payload);
  }

  pageChange(e) {
    this.pagination.page = e.page + 1;
    this.pagination.limit = e.rows;
    this.listenQueryParamsChanges(this.pagination);
  }

  changeQueryParams(params) {
    this.router.navigate([], {
      relativeTo: this.activRouter,
      queryParams: { ...params },
      queryParamsHandling: "merge",
    });
    this.getData();
  }

  deleteUser(e: string | number) {
    const id: string | number = e;
    this.mainService
      .deleteUser(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          const deleteText: string = "მომხმარებელი წარმატებით წაიშალა";
          this.getData(deleteText);
        },
        (error) => {
          if (typeof error.error !== "string") {
            this.errorText[0].summary = `Check if Json-server is started and use command 'json-server --watch db.json'`;
          } else {
            this.errorText[0].summary = `User list Data ${error.error}`;
          }
          this.chd.markForCheck();
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
