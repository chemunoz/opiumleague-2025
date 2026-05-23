import { Component } from '@angular/core';

interface CountdownEntry {
  deadline: string;
  element: string;
  distance: number;
}

@Component({
  selector: 'app-supercup-spain',
  standalone: true,
  imports: [],
  templateUrl: './supercup-spain.component.html',
  styleUrl: './supercup-spain.component.css',
})
export class SupercupSpainComponent {
  SupercupSpain: CountdownEntry[] = [];

  constructor() {
    this.SupercupSpain = [
      {
        deadline: 'Sep 29, 2020 21:00:00',
        element: 'countdown-SupercupSpain',
        distance: 0,
      },
    ];

    const Competitions = [this.SupercupSpain[0]];

    // Update the count down every 1 second
    const x = setInterval(() => {
      const now = new Date().getTime();

      if (Competitions.length === 0) {
        clearInterval(x);
      }
      Competitions.forEach((competition, index) => {
        const countDownDate = new Date(competition.deadline).getTime();
        const distance = countDownDate - now;
        let text: string;

        competition.distance = distance;
        if (distance < 0) {
          text = 'COMENZADA!!';
          Competitions.splice(index, 1);
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
        if (el !== null) {
          el.innerHTML = text;
        }
      });
    }, 1000);
  }
}
