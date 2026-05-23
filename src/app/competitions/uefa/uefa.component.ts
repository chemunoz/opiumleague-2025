import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-uefa',
  standalone: true,
  imports: [],
  templateUrl: './uefa.component.html',
  styleUrl: './uefa.component.css'
})
export class UefaComponent implements OnInit {
  EuropaLeague: any[] = [];

  constructor() {
    this.EuropaLeague = [
      {
        deadline: 'Mar 19, 2021 21:00:00',
        element: 'countdown-EuropaLeague',
        distance: 0
      }
    ];

    const Competitions = [this.EuropaLeague[0]];

    // Update the count down every 1 second
    const x = setInterval(() => {
      // Get todays date and time
      const now = new Date().getTime();

      if (Competitions.length === 0) { clearInterval(x); }
      Competitions.forEach((competition, index) => {
        // Find the distance between now an the count down date
        const countDownDate = new Date(competition.deadline).getTime();
        const distance = countDownDate - now;
        let text = '';

        competition.distance = distance;
        if (distance < 0) {
          // If the count down is over, write some text
          text = 'COMENZADA!!';
          Competitions.splice(index, 1);
        } else {
          // Time calculations for days, hours, minutes and seconds
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        // Output the result validating that the element exists
        const el = document.getElementById(competition.element);
        if (el !== null) { el.innerHTML = text; }
      });
    }, 1000);
  }

  ngOnInit() {
  }

}
