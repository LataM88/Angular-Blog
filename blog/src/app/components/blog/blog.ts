import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DataService } from '../../services/data';
import { BlogItem } from '../blog-item/blog-item';
import { AddPost } from '../add-post/add-post';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FilterTextPipe } from '../../pipes/filter-text-pipe';
import { PaginatePipe } from '../../pipes/paginate-pipe';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'blog',
  standalone: true,
  imports: [BlogItem, AddPost, CommonModule, FilterTextPipe, PaginatePipe, PaginationComponent],
  providers: [DataService],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  public items$: any;
  @Input() filterText: string = '';

  public itemsPerPage: number = 5;
  public currentPage: number = 1;

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? +params['page'] : 1;
    });
    if (isPlatformBrowser(this.platformId)) {
      this.getAll();
    }
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
    window.scrollTo(0, 0);
  }

  getAll() {
    this.items$ = null;
    this.service.getAll().subscribe(response => {
      this.items$ = response;
    });
  }

  onPostDeleted(postId: string) {
    if (this.items$) {
      this.items$ = this.items$.filter((item: any) => item.id !== postId);
    }
  }
}
