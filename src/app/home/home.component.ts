import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { Player } from '../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  
  readonly players = this.dataService.players;
  readonly sortedPlayers = this.dataService.sortedPlayers;
  
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  
  readonly countdownActive = signal(false);

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    const opiumCountdowns = {
      payment: {
        date: new Date('2025-08-09T23:59:59'),
        element: 'countdown-money'
      },
      start: {
        date: new Date('2025-09-12T16:00:00'),
        element: 'countdown'
      }
    };

    const now = new Date().getTime();
    
    if (opiumCountdowns.payment.date.getTime() > now) {
      this.runTimer(opiumCountdowns.payment.date, opiumCountdowns.payment.element);
    } else if (opiumCountdowns.start.date.getTime() > now) {
      this.runTimer(opiumCountdowns.start.date, opiumCountdowns.start.element);
    }
  }

  private runTimer(targetDate: Date, elementId: string): void {
    this.countdownActive.set(true);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        this.countdownActive.set(false);
        const container = document.getElementById('countdowns');
        if (container) container.style.display = 'none';
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }
}
