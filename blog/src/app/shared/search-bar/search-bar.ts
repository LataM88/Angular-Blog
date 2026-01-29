import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextFormatDirective } from '../../directives/text-format';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, TextFormatDirective, CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})

export class SearchBar implements OnInit {
  public filterText: string = '';

  @Output() name = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] !== this.filterText) {
        this.filterText = params['name'] || '';
        this.name.emit(this.filterText);
      }
    });
  }

  sendFilter() {
    this.router.navigate(['/blog'], {
      queryParams: { name: this.filterText?.toLowerCase() }
    });
    this.name.emit(this.filterText);
  }

  clearSearch() {
    this.filterText = '';
    this.sendFilter();
  }
}

