import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogItemText } from './blog-item-text';

describe('BlogItemText', () => {
  let component: BlogItemText;
  let fixture: ComponentFixture<BlogItemText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogItemText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogItemText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
