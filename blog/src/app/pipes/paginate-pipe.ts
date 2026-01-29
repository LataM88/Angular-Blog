import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true
})
export class PaginatePipe implements PipeTransform {
  transform(items: any[], page: number, perPage: number): any[] {
    if (!items) return [];
    if (page < 1) page = 1;
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }
}
