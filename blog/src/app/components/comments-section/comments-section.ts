import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommentsService, Comment } from '../../services/comments';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss'
})
export class CommentsSection implements OnInit {
  @Input() postId?: string;
  @Input() postAuthorId?: string;

  public comments: Comment[] = [];
  public newCommentText: string = '';

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (this.postId && isPlatformBrowser(this.platformId)) {
      this.refreshComments();
    }
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  refreshComments() {
    if (this.postId) {
      this.commentsService.getComments(this.postId).subscribe({
        next: (comments) => this.comments = comments,
        error: (err) => console.error('Failed to load comments:', err)
      });
    }
  }

  addComment() {
    if (!this.postId || !this.newCommentText || !this.currentUser) return;

    this.commentsService.addComment(
      this.postId,
      this.currentUser.userId,
      this.currentUser.name,
      this.newCommentText
    ).subscribe({
      next: () => {
        this.newCommentText = '';
        this.refreshComments();
      },
      error: (err) => console.error('Failed to add comment:', err)
    });
  }

  canDelete(comment: Comment): boolean {
    if (!this.currentUser) return false;
    const userId = String(this.currentUser.userId);
    const commentAuthorId = String(comment.authorId);
    const postAuthorId = this.postAuthorId ? String(this.postAuthorId) : '';

    // Can delete if: user is comment author OR user is post author
    return userId === commentAuthorId || userId === postAuthorId;
  }

  deleteComment(comment: Comment) {
    if (!this.currentUser) return;

    if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
      this.commentsService.deleteComment(
        comment.id,
        this.currentUser.userId,
        this.postAuthorId || ''
      ).subscribe({
        next: () => this.refreshComments(),
        error: (err) => {
          console.error('Failed to delete comment:', err);
          alert('Nie udało się usunąć komentarza');
        }
      });
    }
  }
}

