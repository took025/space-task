import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountModelComponent } from './account-model.component';

describe('AccountModelComponent', () => {
  let component: AccountModelComponent;
  let fixture: ComponentFixture<AccountModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
