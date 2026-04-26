import { Component, OnInit, AfterViewInit, inject, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from '../core/services/chart.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private chartService = inject(ChartService);

  @ViewChild('historyChart') historyChartRef!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.chartService.destroyChart('history-chart');
  }

  private createChart(): void {
    const labels = [
      'Che', 'David O.',
      'Adolfo', 'Fran', 'JC', 'Mario',
      'Luis', 'Paloma',
      'Raúl',
      'Danilo', 'Chente',
      'A.Cadelo', 'Borja R.', 'Dani', 'Javi', 'Nandelas', 'Serious', 'Will', 'David M.',
      'Borja L.', 'Diego', 'Juanan',
      'Ru', 'Carlos Julio', 'Ivan', 'Raúl Magni', 'Ovidiu',
      'Chus Contador', 'Cruchi', 'Dani Magni', 'Dioni', 'Ekaitz', 'Nando', 'Dani G.', 'Ines', 'Pablo', 'Felipe', 'Zea',
      'Chema', 'Manunu', 'Javier Rey', 'Javi', 'Javi N.', 'Lorea', 'Luis R.', 'Richard', 'Ezequiel', 'Mayfex', 'Nuria', 'Dani L.', 'Javichu', 'Daniel', 'Pedro', 'Hector',
      'Adrialys', 'Cresmar', 'David', 'Jose Ramón', 'Poli', 'Rafa', 'Jose C.', 'Vanessa', 'Ramón', 'Murube', 'Pablo', 'Juanjo'
    ];

    const data = [
      12, 12, 10, 10, 10, 10, 9, 9, 8, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

    const colors = [
      '#dc4f21', '#dc4f21',
      '#a09661', '#a09661', '#a09661', '#a09661',
      '#01fe6e', '#01fe6e',
      '#58d7d7',
      '#d33497', '#d33497',
      '#1a8251', '#1a8251', '#1a8251', '#1a8251', '#1a8251', '#1a8251', '#1a8251', '#1a8251',
      '#fdfe5f', '#fdfe5f', '#fdfe5f',
      '#d8944d', '#d8944d', '#d8944d', '#d8944d', '#d8944d',
      '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da', '#7eb5da',
      '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12', '#e03d12',
      '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5', '#a1b2d5'
    ];

    if (this.historyChartRef?.nativeElement) {
      this.chartService.createBarChart(
        'history-chart',
        labels.slice(0, data.length),
        [{
          label: 'Temporadas',
          data: data,
          backgroundColor: colors
        }],
        {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'RESUMEN GRÁFICO' }
          },
          scales: {
            x: { display: true },
            y: { display: true, beginAtZero: true }
          }
        }
      );
    }
  }
}
