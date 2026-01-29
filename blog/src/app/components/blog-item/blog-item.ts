import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogItemImage } from '../blog-item-image/blog-item-image';
import { BlogItemText } from '../blog-item-text/blog-item-text';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data';
import { LikesService } from '../../services/likes.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'blog-item',
  imports: [CommonModule, RouterModule, BlogItemImage, FormsModule],
  templateUrl: './blog-item.html',
  styleUrl: './blog-item.scss',
})
export class BlogItem {
  @Input() image?: string;
  @Input() text?: string;
  @Input() id?: string;
  @Input() authorId?: string;
  @Input() title?: string;
  @Input() likes: number = 0;
  @Input() likedBy: string[] = [];
  @Output() postDeleted = new EventEmitter<string>();
  @Output() postUpdated = new EventEmitter<void>();

  isEditing = false;
  editTitle = '';
  editText = '';
  editImage = '';
  likesCount: number = 0;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private dataService: DataService,
    private likesService: LikesService
  ) { }

  ngOnInit() {
    this.likesCount = this.likes || 0;
  }

  get isFavorite(): boolean {
    return this.id ? this.favoritesService.isFavorite(this.id) : false;
  }

  get isAuthor(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.authorId) {
      return false;
    }
    const currentUserId = String(currentUser.userId);
    const postAuthorId = String(this.authorId);
    return currentUserId === postAuthorId;
  }

  get isLiked(): boolean {
    const currentUser = this.authService.currentUser;
    return this.likesService.isLikedByUser(this.likedBy, currentUser?.userId);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleLike(): void {
    const currentUser = this.authService.currentUser;
    if (!this.id || !currentUser) return;

    this.likesService.toggleLike(this.id, currentUser.userId).subscribe({
      next: (response) => {
        this.likesCount = response.likes;
        this.likedBy = response.likedBy;
      },
      error: (err) => console.error('Failed to toggle like:', err)
    });
  }

  toggleFavorite(): void {
    if (this.id) {
      this.favoritesService.toggleFavorite(this.id);
    }
  }

  startEdit(): void {
    this.editTitle = this.title || '';
    this.editText = this.text || '';
    this.editImage = this.image || '';
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (!this.id || !this.authorId) return;

    this.dataService.updatePost(this.id, {
      title: this.editTitle,
      text: this.editText,
      image: this.editImage,
      authorId: this.authorId
    }).subscribe({
      next: () => {
        this.title = this.editTitle;
        this.text = this.editText;
        this.image = this.editImage;
        this.isEditing = false;
        this.postUpdated.emit();
      },
      error: (err) => {
        console.error('Failed to update post:', err);
        alert('Nie udało się zaktualizować posta');
      }
    });
  }

  deletePost(): void {
    if (!this.id || !this.authorId) return;

    if (confirm('Czy na pewno chcesz usunąć ten post?')) {
      this.dataService.deletePost(this.id, this.authorId).subscribe({
        next: () => {
          this.postDeleted.emit(this.id);
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('Nie udało się usunąć posta');
        }
      });
    }
  }
}

