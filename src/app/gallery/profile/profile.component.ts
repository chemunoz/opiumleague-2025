import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ChartService } from '../../core/services/chart.service';
import { Player } from '../../core/models';

interface TrophyInfo {
  kind: string;
  title: string;
}

interface AwardInfo {
  kind: string;
  title: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private chartService = inject(ChartService);

  @ViewChild('pointsChart') pointsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('positionsChart')
  positionsChartRef!: ElementRef<HTMLCanvasElement>;

  player: Player | undefined;
  private trophiesList: TrophyInfo[] = [];
  private awardsList: AwardInfo[] = [];

  constructor() {
    this.route.params.subscribe((params) => {
      this.player = this.dataService.getPlayer(params['id']);
    });
  }

  ngOnInit() {
    if (this.player) {
      this.calculateStats();
    }
  }

  ngAfterViewInit() {
    if (this.player) {
      this.createCharts();
    }
  }

  ngOnDestroy() {
    this.chartService.destroyChart('points-chart');
    this.chartService.destroyChart('positions-chart');
  }

  getTrophies(): TrophyInfo[] {
    return this.trophiesList;
  }

  getAwards(): AwardInfo[] {
    return this.awardsList;
  }

  private calculateStats(): void {
    if (!this.player) return;

    this.player.positions_general_differences =
      this.player.positions_general?.map((value, index) =>
        index === 0
          ? 0
          : (this.player!.positions_general?.[index - 1] ?? 0) - value,
      ) ?? [];

    const diffs = this.player.positions_general_differences.filter(
      (v): v is number => !isNaN(v),
    );
    this.player.positions_general_differences_max =
      diffs.length === 0 ? 0 : Math.max(...diffs);
    this.player.positions_general_differences_min =
      diffs.length === 0 ? 0 : Math.abs(Math.min(...diffs));

    this.trophiesList = [];
    let totalTrophies = 0;

    if (this.player.trophies) {
      Object.keys(this.player.trophies).forEach((key) => {
        const trophy =
          this.player!.trophies[key as keyof typeof this.player.trophies];
        if (trophy && trophy.length > 0) {
          totalTrophies += trophy.length;
          trophy.forEach(() => {
            this.trophiesList.push({ kind: key, title: key.replace('_', ' ') });
          });
        }
      });
    }

    this.player.trophies_total = totalTrophies;

    this.awardsList = [];
    let totalAwards = 0;

    if (this.player.awards) {
      Object.keys(this.player.awards).forEach((key) => {
        const award =
          this.player!.awards[key as keyof typeof this.player.awards];
        if (award && award.length > 0) {
          totalAwards += award.length;
          award.forEach(() => {
            if (key === 'round_top') {
              this.awardsList.push({
                kind: 'fas fa-award',
                title: 'Jornada Top',
              });
            } else if (key === 'rounds_regularity') {
              this.awardsList.push({
                kind: 'fas fa-star',
                title: 'Premio Regularidad',
              });
            }
          });
        }
      });
    }

    this.player.awards_total = totalAwards;

    if (this.player.positions_general) {
      const validPositions = this.player.positions_general.filter(
        (v): v is number => !isNaN(v),
      );
      this.player.positions_general_max =
        validPositions.length === 0 ? 0 : Math.max(...validPositions);
      this.player.positions_general_min =
        validPositions.length === 0 ? 0 : Math.abs(Math.min(...validPositions));
    }
  }

  private createCharts(): void {
    if (!this.player) return;

    const validPoints = this.player.points.filter(
      (v): v is number => v !== null,
    );
    const labels = validPoints.map((_, i) => `J${i + 1}`);

    const ejeYJornada = validPoints;
    const ejeYMedia = this.player.score_average_jornada || [];
    const ejeYPosicionesGeneral = this.player.positions_general || [];
    const ejeYPosicionesJornada = this.player.positions_jornada || [];

    try {
      if (this.pointsChartRef?.nativeElement) {
        this.chartService.createLineChart(
          'points-chart',
          labels,
          [
            {
              label: 'Puntos',
              data: ejeYJornada,
              borderColor: '#e94560',
              backgroundColor: 'rgba(233, 69, 96, 0.1)',
            },
            {
              label: 'Media',
              data: ejeYMedia,
              borderColor: '#16213e',
              backgroundColor: 'rgba(22, 33, 62, 0.1)',
            },
          ],
          {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              title: { display: true, text: 'PUNTOS - Jornada vs Media' },
            },
            scales: {
              x: { display: true },
              y: { display: true, beginAtZero: false },
            },
          },
        );
      }

      if (this.positionsChartRef?.nativeElement) {
        this.chartService.createLineChart(
          'positions-chart',
          labels,
          [
            {
              label: 'Posición Jornada',
              data: ejeYPosicionesJornada,
              borderColor: '#e94560',
              backgroundColor: 'rgba(233, 69, 96, 0.1)',
            },
            {
              label: 'Posición General',
              data: ejeYPosicionesGeneral,
              borderColor: '#16213e',
              backgroundColor: 'rgba(22, 33, 62, 0.1)',
            },
          ],
          {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              title: { display: true, text: 'POSICIONES - Jornada vs General' },
            },
            scales: {
              x: { display: true },
              y: { display: true, beginAtZero: true, reverse: true },
            },
          },
        );
      }
    } catch (error) {
      console.error('Error creating charts:', error);
    }
  }
}
