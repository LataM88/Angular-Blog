import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from "../../services/data";
import { AuthService } from "../../services/auth.service";
import { LikesService } from "../../services/likes.service";
import { RatingService } from "../../services/rating.service";
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsSection } from '../comments-section/comments-section';

@Component({
  selector: 'app-blog-item-details',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, CommentsSection],
  templateUrl: './blog-item-details.html',
  styleUrl: './blog-item-details.scss'
})
export class BlogItemDetailsComponent implements OnInit {
  public id: string = '';
  public image: string = '';
  public text: string = '';
  public title: string = '';
  public authorId: string = '';
  public likesCount: number = 0;
  public likedBy: string[] = [];

  // Poll properties
  public pollEnabled: boolean = false;
  public pollQuestion: string = '';
  public pollOptions: { text: string; votes: number }[] = [];
  public pollVoters: string[] = [];
  public selectedPollOption: number = -1;

  // Rating properties
  public averageRating: number = 0;
  public ratingCount: number = 0;
  public ratings: { userId: string; stars: number }[] = [];
  public hoverRating: number = 0;

  isEditing = false;
  editTitle = '';
  editText = '';
  editImage = '';

  constructor(
    private service: DataService,
    private authService: AuthService,
    private likesService: LikesService,
    private ratingService: RatingService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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

  get hasVoted(): boolean {
    const currentUser = this.authService.currentUser;
    return this.ratingService.hasVoted(this.pollVoters, currentUser?.userId);
  }

  get userRating(): number {
    const currentUser = this.authService.currentUser;
    return this.ratingService.getUserRating(this.ratings, currentUser?.userId);
  }

  get totalVotes(): number {
    return this.pollOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  }

  getVotePercentage(votes: number): number {
    if (this.totalVotes === 0) return 0;
    return Math.round((votes / this.totalVotes) * 100);
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

  vote(): void {
    const currentUser = this.authService.currentUser;
    if (!this.id || !currentUser || this.selectedPollOption < 0) return;

    this.ratingService.vote(this.id, currentUser.userId, this.selectedPollOption).subscribe({
      next: (response) => {
        this.pollOptions = response.pollOptions;
        this.pollVoters = response.pollVoters;
      },
      error: (err) => {
        console.error('Failed to vote:', err);
        alert(err.error?.error || 'Nie udało się zagłosować');
      }
    });
  }

  rate(stars: number): void {
    const currentUser = this.authService.currentUser;
    if (!this.id || !currentUser || this.isAuthor) return;

    this.ratingService.rate(this.id, currentUser.userId, stars).subscribe({
      next: (response) => {
        this.averageRating = response.averageRating;
        this.ratingCount = response.ratingCount;
        // Update local ratings
        const existingIndex = this.ratings.findIndex(r => r.userId === currentUser.userId);
        if (existingIndex !== -1) {
          this.ratings[existingIndex].stars = stars;
        } else {
          this.ratings.push({ userId: currentUser.userId, stars });
        }
      },
      error: (err) => {
        console.error('Failed to rate:', err);
        alert(err.error?.error || 'Nie udało się ocenić');
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.id = id;

      if (isPlatformBrowser(this.platformId)) {
        this.service.getById(id).subscribe((res: any) => {
          console.log('Result from server:', res);
          this.image = res.image;
          if (this.image && !this.image.startsWith('http')) {
            this.image = 'https://' + this.image;
          }
          this.text = res.text;
          this.title = res.title;
          this.authorId = res.authorId || '';
          this.likesCount = res.likes || 0;
          this.likedBy = res.likedBy || [];
          // Poll data
          this.pollEnabled = res.pollEnabled || false;
          this.pollQuestion = res.pollQuestion || '';
          this.pollOptions = res.pollOptions || [];
          this.pollVoters = res.pollVoters || [];
          // Rating data
          this.averageRating = res.averageRating || 0;
          this.ratingCount = res.ratingCount || 0;
          this.ratings = res.ratings || [];
        });
      }
    });
  }

  startEdit(): void {
    this.editTitle = this.title;
    this.editText = this.text;
    this.editImage = this.image;
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (!this.id || !this.authorId) return;

    this.service.updatePost(this.id, {
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
      this.service.deletePost(this.id, this.authorId).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('Nie udało się usunąć posta');
        }
      });
    }
  }
}
