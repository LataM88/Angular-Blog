import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DataService } from '../../services/data';
import { FavoritesService } from '../../services/favorites.service';
import { BlogItem } from '../blog-item/blog-item';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BlogItem],
  providers: [DataService],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public favorites: any[] = [];
  public loading: boolean = true;

  constructor(
    private dataService: DataService,
    private favoritesService: FavoritesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dataService.getAll().subscribe((response: any) => {
        const items = response as any[];
        this.favorites = items.filter(item => this.favoritesService.isFavorite(item.id));
        this.loading = false;
      });
    } else {
      this.loading = false; // Stop loading state on server to avoid indefinite spinner
    }
  }
}
