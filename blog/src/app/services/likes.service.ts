import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LikeResponse {
    likes: number;
    likedBy: string[];
    isLiked: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LikesService {
    private url = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    toggleLike(postId: string, userId: string): Observable<LikeResponse> {
        return this.http.post<LikeResponse>(`${this.url}/posts/${postId}/like`, { userId });
    }

    isLikedByUser(likedBy: string[] | undefined, userId: string | undefined): boolean {
        if (!likedBy || !userId) return false;
        return likedBy.includes(String(userId));
    }
}
