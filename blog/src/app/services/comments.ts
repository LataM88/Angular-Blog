import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}/posts/${postId}/comments`);
  }

  addComment(postId: string, authorId: string, authorName: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.url}/posts/${postId}/comments`, {
      authorId,
      authorName,
      text
    });
  }

  deleteComment(commentId: string, userId: string, postAuthorId: string): Observable<void> {
    return this.http.request<void>('delete', `${this.url}/comments/${commentId}`, {
      body: { userId, postAuthorId }
    });
  }
}
