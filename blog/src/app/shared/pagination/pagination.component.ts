import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() totalItems: number = 0;
    @Input() itemsPerPage: number = 5;
    @Input() currentPage: number = 1;
    @Output() pageChange = new EventEmitter<number>();

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    get pages(): number[] {
        return Array(this.totalPages).fill(0).map((x, i) => i + 1);
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }
}
