import { Component, OnInit, AfterViewInit, inject, ChangeDetectionStrategy, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { DataService } from '../core/services/data.service';
import { ChartService } from '../core/services/chart.service';
import { Player } from '../core/models';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataService = inject(DataService);
  private chartService = inject(ChartService);

  @ViewChild('jornadaWinnerChart') jornadaWinnerChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('leaderChart') leaderChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('championsChart') championsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('uefaChart') uefaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('intertotoChart') intertotoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('descensoChart') descensoChartRef!: ElementRef<HTMLCanvasElement>;

  readonly players = signal<Player[]>([]);

  constructor() {
    const playersData = this.dataService.players();
    this.players.set(playersData);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.createCharts();
  }

  ngOnDestroy() {
    this.chartService.destroyAllCharts();
  }

  private createCharts(): void {
    const players = this.players();
    const cmp = (x: number, y: number) => (x > y ? 1 : x < y ? -1 : 0);

    const sortedPlayers = [...players].sort((a, b) => cmp(a.name.localeCompare(b.name), b.name.localeCompare(a.name)));

    const positionSeries = {
      leader: [] as { name: string; y: number }[],
      champions: [] as { name: string; y: number }[],
      uefa: [] as { name: string; y: number }[],
      intertoto: [] as { name: string; y: number }[],
      descenso: [] as { name: string; y: number }[],
      jornada_winner: [] as { name: string; data: number[] }[]
    };

    const filterPlayers = sortedPlayers.filter(p => p.positions_general && p.positions_general.length > 0);

    filterPlayers.forEach((player) => {
      const positionsGeneral = player.positions_general || [];
      const positionsJornada = player.positions_jornada || [];

      if (positionsGeneral.filter(p => p === 1).length > 0) {
        positionSeries.leader.push({
          name: `${player.team} (${positionsGeneral.filter(p => p === 1).length})`,
          y: positionsGeneral.filter(p => p === 1).length
        });
      }
      if (positionsGeneral.filter(p => p <= 4).length > 0) {
        positionSeries.champions.push({
          name: `${player.team} (${positionsGeneral.filter(p => p <= 4).length})`,
          y: positionsGeneral.filter(p => p <= 4).length
        });
      }
      if (positionsGeneral.filter(p => p > 4 && p < 8).length > 0) {
        positionSeries.uefa.push({
          name: `${player.team} (${positionsGeneral.filter(p => p > 4 && p < 8).length})`,
          y: positionsGeneral.filter(p => p > 4 && p < 8).length
        });
      }
      if (positionsGeneral.filter(p => p > 7 && p < 11).length > 0) {
        positionSeries.intertoto.push({
          name: `${player.team} (${positionsGeneral.filter(p => p > 7 && p < 11).length})`,
          y: positionsGeneral.filter(p => p > 7 && p < 11).length
        });
      }
      if (positionsGeneral.filter(p => p >= filterPlayers.length - 3).length > 0) {
        positionSeries.descenso.push({
          name: `${player.team} (${positionsGeneral.filter(p => p >= filterPlayers.length - 3).length})`,
          y: positionsGeneral.filter(p => p >= filterPlayers.length - 3).length
        });
      }

      if (positionsJornada.filter(p => p === 1).length > 0) {
        positionSeries.jornada_winner.push({
          name: player.team,
          data: [positionsJornada.filter(p => p === 1).length]
        });
      }
    });

    // Sort series
    Object.keys(positionSeries).forEach(serie => {
      if (serie === 'jornada_winner') {
        (positionSeries as any)[serie].sort((a: any, b: any) => cmp(-cmp(a.data[0], b.data[0]), -cmp(b.data[0], a.data[0])));
      } else {
        (positionSeries as any)[serie].sort((a: any, b: any) => cmp(-cmp(a.y, b.y), -cmp(b.y, a.y)));
      }
    });

    // Create charts
    try {
      if (this.jornadaWinnerChartRef?.nativeElement) {
        this.chartService.createBarChart(
          'jornada-winner-chart',
          ['JORNADAS'],
          positionSeries.jornada_winner.map(ds => ({
            label: ds.name,
            data: ds.data,
            backgroundColor: '#e94560'
          }))
        );
      }

      if (this.leaderChartRef?.nativeElement) {
        this.chartService.createPieChart(
          'leader-chart',
          positionSeries.leader.map(d => d.name),
          positionSeries.leader.map(d => d.y)
        );
      }

      if (this.championsChartRef?.nativeElement) {
        this.chartService.createPieChart(
          'champions-chart',
          positionSeries.champions.map(d => d.name),
          positionSeries.champions.map(d => d.y)
        );
      }

      if (this.uefaChartRef?.nativeElement) {
        this.chartService.createPieChart(
          'uefa-chart',
          positionSeries.uefa.map(d => d.name),
          positionSeries.uefa.map(d => d.y)
        );
      }

      if (this.intertotoChartRef?.nativeElement) {
        this.chartService.createPieChart(
          'intertoto-chart',
          positionSeries.intertoto.map(d => d.name),
          positionSeries.intertoto.map(d => d.y)
        );
      }

      if (this.descensoChartRef?.nativeElement) {
        this.chartService.createPieChart(
          'descenso-chart',
          positionSeries.descenso.map(d => d.name),
          positionSeries.descenso.map(d => d.y)
        );
      }
    } catch (error) {
      console.error('Error creating charts:', error);
    }
  }
}
