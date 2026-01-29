import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public url = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(this.url + '/api/posts');
  }

  getById(id: string) {
    return this.http.get(this.url + '/api/posts/' + id);
  }

  public addPost(post: any) {
    return this.http.post(this.url + '/api/posts', post);
  }

  public updatePost(id: string, post: any) {
    return this.http.put(this.url + '/api/posts/' + id, post);
  }

  public deletePost(id: string, authorId: string) {
    return this.http.request('delete', this.url + '/api/posts/' + id, {
      body: { authorId }
    });
  }
}
