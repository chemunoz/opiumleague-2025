import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  private dataService = inject(DataService);

  readonly players = computed(() => {
    const cmp = (x: number, y: number) => (x > y ? 1 : x < y ? -1 : 0);
    return [...this.dataService.players()].sort((a, b) => 
      cmp(-(a.badges?.avg ?? 0), -(b.badges?.avg ?? 0))
    );
  });
}
