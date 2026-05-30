import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChampionsService } from '../../core/services/champions.service';
import { ChampionsCountdown } from '../../core/models';

interface CountdownEntry {
  deadline: string;
  element: string;
  distance: number;
}

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.css',
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  private championsService = inject(ChampionsService);

  FOCup: CountdownEntry[] = [
    {
      deadline: 'Oct 17, 2020 16:00:00',
      element: 'countdown-draw-FOCup',
      distance: 0,
    },
    {
      deadline: 'Oct 23, 2020 21:00:00',
      element: 'countdown-FOCup',
      distance: 0,
    },
  ];
  Champions: ChampionsCountdown[] = [];
  EuropaLeague: CountdownEntry[] = [
    {
      deadline: 'Mar 19, 2021 21:00:00',
      element: 'countdown-EuropaLeague',
      distance: 0,
    },
  ];
  SupercupEuropa: CountdownEntry[] = [
    {
      deadline: 'Sep 19, 2020 16:00:00',
      element: 'countdown-SupercupEuropa',
      distance: 0,
    },
  ];
  SupercupSpain: CountdownEntry[] = [
    {
      deadline: 'Sep 29, 2020 21:00:00',
      element: 'countdown-SupercupSpain',
      distance: 0,
    },
  ];
  SupercupOpium: CountdownEntry[] = [
    {
      deadline: 'Jan 19, 2021 21:00:00',
      element: 'countdown-SupercupOpium',
      distance: 0,
    },
  ];

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.Champions = this.championsService.getCountdowns();
    this.startCountdowns();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdowns(): void {
    const competitions: (CountdownEntry | ChampionsCountdown)[] = [
      this.FOCup[0],
      this.FOCup[1],
      ...(this.Champions[0] ? [this.Champions[0]] : []),
      ...(this.Champions[1] ? [this.Champions[1]] : []),
      this.EuropaLeague[0],
      this.SupercupEuropa[0],
      this.SupercupSpain[0],
      this.SupercupOpium[0],
    ];

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
