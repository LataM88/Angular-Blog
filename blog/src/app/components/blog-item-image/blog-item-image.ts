import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog-item-image',
  imports: [],
  templateUrl: './blog-item-image.html',
  styleUrl: './blog-item-image.scss',
})
export class BlogItemImage {
  @Input() image?: string;
}
