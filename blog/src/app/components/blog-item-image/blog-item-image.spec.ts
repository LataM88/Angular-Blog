import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogItemImage } from './blog-item-image';

describe('BlogItemImage', () => {
  let component: BlogItemImage;
  let fixture: ComponentFixture<BlogItemImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogItemImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogItemImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
