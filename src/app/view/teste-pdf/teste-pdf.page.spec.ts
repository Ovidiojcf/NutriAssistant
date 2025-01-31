import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestePdfPage } from './teste-pdf.page';

describe('TestePdfPage', () => {
  let component: TestePdfPage;
  let fixture: ComponentFixture<TestePdfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestePdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
