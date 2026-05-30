import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

interface CountdownEntry {
  deadline: string;
  element: string;
  distance: number;
}

@Component({
  selector: 'app-uefa',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uefa.component.html',
  styleUrl: './uefa.component.css',
})
export class UefaComponent implements OnInit, OnDestroy {
  EuropaLeague: CountdownEntry[] = [
    {
      deadline: 'Mar 19, 2021 21:00:00',
      element: 'countdown-EuropaLeague',
      distance: 0,
    },
  ];

  readonly activeTab = signal<string>('final');

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startCountdowns();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdowns(): void {
    const competitions = [...this.EuropaLeague];

    const update = () => {
      const now = new Date().getTime();
      competitions.forEach((competition, index) => {
        const distance = new Date(competition.deadline).getTime() - now;
        competition.distance = distance;

        let text: string;
        if (distance < 0) {
          text = 'COMENZADA!!';
          competitions.splice(index, 1);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const el = document.getElementById(competition.element);
        if (el) el.textContent = text;
      });

      if (competitions.length === 0 && this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }
}
