import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VoteResponse {
    pollOptions: { text: string; votes: number }[];
    pollVoters: string[];
}

export interface RateResponse {
    averageRating: number;
    ratingCount: number;
    userRating: number;
}

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private url = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    vote(postId: string, userId: string, optionIndex: number): Observable<VoteResponse> {
        return this.http.post<VoteResponse>(`${this.url}/posts/${postId}/vote`, { userId, optionIndex });
    }

    rate(postId: string, userId: string, stars: number): Observable<RateResponse> {
        return this.http.post<RateResponse>(`${this.url}/posts/${postId}/rate`, { userId, stars });
    }

    hasVoted(pollVoters: string[] | undefined, userId: string | undefined): boolean {
        if (!pollVoters || !userId) return false;
        return pollVoters.includes(String(userId));
    }

    getUserRating(ratings: { userId: string; stars: number }[] | undefined, userId: string | undefined): number {
        if (!ratings || !userId) return 0;
        const userRating = ratings.find(r => r.userId === String(userId));
        return userRating ? userRating.stars : 0;
    }
}
