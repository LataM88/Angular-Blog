import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'blog_favorites';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getFavorites(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  toggleFavorite(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const favorites = this.getFavorites();
      const index = favorites.indexOf(id);
      
      if (index === -1) {
        favorites.push(id);
      } else {
        favorites.splice(index, 1);
      }
      
      this.saveFavorites(favorites);
    }
  }

  isFavorite(id: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const favorites = this.getFavorites();
      return favorites.includes(id);
    }
    return false;
  }

  private saveFavorites(favorites: string[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
  }
}
