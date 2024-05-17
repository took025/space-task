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
import { TableModule, TablePageEvent } from "primeng/table";
import { mainService } from "../../core/services/main-service";
import { apiData, userInterface } from "../../core/interface/interface";
import { ActionButtonsComponent } from "../../shared/components/action-buttons/action-buttons.component";
import { Paginator, PaginatorModule } from "primeng/paginator";
import { Message, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { MessagesModule } from "primeng/messages";
import { Subject, filter, takeUntil } from "rxjs";
import { EmptyPipe } from "../../core/pipes/empty.pipe";

@Component({
  selector: "app-clients-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
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
  userList: apiData;
  public pagination = {
    page: 1,
    limit: 10,
  };
  first: number;
  errorText: Message[] | undefined = [{ severity: "error", summary: null }];

  constructor(
    private mainService: mainService,
    private activRouter: ActivatedRoute,
    private router: Router,
    private chd: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listenQueryParamsChanges();
  }

  getData(text?: string) {
    this.mainService
      .getData(this.pagination.page, this.pagination.limit)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: apiData) => {
          this.userList = res;
          this.chd.markForCheck();
          setTimeout(() => {
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
    if (pagination) {
      this.changeQueryParams();
      return;
    }
    this.activRouter.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((queryParams) => {
        if (queryParams?.page && queryParams?.limit) {
          this.pagination = {
            page: queryParams.page,
            limit: queryParams.limit,
          };
        }
        const event = {
          page: queryParams.page,
          rows: queryParams.limit,
        };
        this.first = (queryParams?.page - 1) * queryParams?.limit;
      });
    this.changeQueryParams();
  }

  pageChange(e: any) {
    this.pagination.page = e.page + 1;
    this.pagination.limit = e.rows;
    this.listenQueryParamsChanges(this.pagination);
  }

  changeQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activRouter,
      queryParams: { ...this.pagination },
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
