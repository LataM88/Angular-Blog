import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements OnInit {
  public images: string[] = [];
  public selectedImage: string | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAll().subscribe((posts: any) => {
      this.images = posts.map((post: any) => post.image);
    });
  }

  openImage(image: string) {
    this.selectedImage = image;
  }

  closeImage() {
    this.selectedImage = null;
  }
}
