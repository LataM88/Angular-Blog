import { Component, Input } from '@angular/core';
import { SummaryPipe } from '../../pipes/summary-pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'blog-item-text',
  imports: [SummaryPipe, RouterModule],
  templateUrl: './blog-item-text.html',
  styleUrl: './blog-item-text.scss',
})
export class BlogItemText {
  @Input() text?: string;
  @Input() id?: string;
}
