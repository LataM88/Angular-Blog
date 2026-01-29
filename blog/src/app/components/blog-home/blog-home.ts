import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Blog } from '../blog/blog';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [SearchBar, Blog, RouterLink],
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.scss',
})
export class BlogHome implements OnInit {
  public filterText: string = '';

  @ViewChild(Blog) blogComponent!: Blog;

  constructor() {
  }

  ngOnInit(): void {
  }

  getName($event: string): void {
    this.filterText = $event;
  }

  refreshPosts(): void {
    if (this.blogComponent) {
      this.blogComponent.getAll();
    }
  }
}
