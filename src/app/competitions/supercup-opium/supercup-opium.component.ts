import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-supercup-opium',
  standalone: true,
  imports: [],
  templateUrl: './supercup-opium.component.html',
  styleUrl: './supercup-opium.component.css'
})
export class SupercupOpiumComponent implements OnInit {
  SupercupOpium: any[] = [];

  constructor() {
    this.SupercupOpium = [
      {
        deadline: 'Jan 19, 2021 21:00:00',
        element: 'countdown-SupercupOpium',
        distance: 0
      }
    ];

    const Competitions = [this.SupercupOpium[0]];

    // Update the count down every 1 second
    const x = setInterval(() => {
      const now = new Date().getTime();

      if (Competitions.length === 0) { clearInterval(x); }
      Competitions.forEach((competition, index) => {
        const countDownDate = new Date(competition.deadline).getTime();
        const distance = countDownDate - now;
        let text = '';

        competition.distance = distance;
        if (distance < 0) {
          text = 'COMENZADA!!';
          Competitions.splice(index, 1);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const el = document.getElementById(competition.element);
        if (el !== null) { el.innerHTML = text; }
      });
    }, 1000);
  }

  ngOnInit() {}

}
