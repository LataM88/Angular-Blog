import { Component, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'add-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-post.html',
  styleUrl: './add-post.scss'
})
export class AddPost {
  public title: string = '';
  public text: string = '';
  public image: string = '';
  public pollEnabled: boolean = false;
  public pollQuestion: string = 'Jak oceniasz ten post?';
  public pollOptions: string[] = ['Pomocny', 'Ciekawy', 'Interesujący'];

  @Output() postAdded = new EventEmitter<void>();

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addPollOption() {
    this.pollOptions.push('');
  }

  removePollOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  addPost() {
    if (this.title && this.text) {
      const authorId = this.authService.currentUser?.userId;
      const postData: any = {
        title: this.title,
        text: this.text,
        image: this.image || 'https://via.placeholder.com/150',
        authorId: authorId
      };

      if (this.pollEnabled) {
        postData.pollEnabled = true;
        postData.pollQuestion = this.pollQuestion;
        postData.pollOptions = this.pollOptions
          .filter(opt => opt.trim())
          .map(text => ({ text, votes: 0 }));
      }

      this.dataService.addPost(postData).subscribe({
        next: () => {
          this.postAdded.emit();
          // Reset form
          this.title = '';
          this.text = '';
          this.image = '';
          this.pollEnabled = false;
          this.pollQuestion = 'Jak oceniasz ten post?';
          this.pollOptions = ['Pomocny', 'Ciekawy', 'Interesujący'];
        }
      });
    }
  }
}
