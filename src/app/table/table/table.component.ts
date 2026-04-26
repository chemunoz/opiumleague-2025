import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { TeamStanding } from '../../core/models';

export type Tab = 'general' | 'hist-general' | 'hist-jornada';

interface JornadaEntry {
  key: string;
  name: string;
  teams: TeamStanding[];           // sorted by position_general
  teamsByJornada: TeamStanding[]; // sorted by position_jornada
  score_best?:  { name: string; team: string; image: string; shield: string; score: number };
  score_worst?: { name: string; team: string; image: string; shield: string; score: number };
  score_average?: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  private dataService = inject(DataService);

  readonly activeTab = signal<Tab>('general');
  readonly jornadas = signal<JornadaEntry[]>([]);
  private readonly rachaMap = new Map<number, number[]>();

  readonly lastJornada = computed(() => {
    const list = this.jornadas();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  constructor() {
    const raw = this.dataService.getJornadas() as Record<string, any>;
    const entries: JornadaEntry[] = Object.keys(raw)
      .filter(k => k.startsWith('jornada_'))
      .sort((a, b) => parseInt(a.split('_')[1], 10) - parseInt(b.split('_')[1], 10))
      .map(key => ({
        key,
        name: raw[key].name ?? key.replace('_', ' ').toUpperCase(),
        teams: [...raw[key]] as TeamStanding[],
        teamsByJornada: ([...raw[key]] as TeamStanding[])
          .sort((a: any, b: any) => a.position_jornada - b.position_jornada),
        score_best:    raw[key].score_best,
        score_worst:   raw[key].score_worst,
        score_average: raw[key].score_average
      }));

    // Build racha: playerId → all round scores in chronological order
    entries.forEach(entry => {
      entry.teamsByJornada.forEach(team => {
        if (!this.rachaMap.has(team.id)) this.rachaMap.set(team.id, []);
        this.rachaMap.get(team.id)!.push(team.score_jornada);
      });
    });

    this.jornadas.set(entries);
  }

  setTab(tab: Tab): void { this.activeTab.set(tab); }

  getRacha(id: number): number[] {
    return (this.rachaMap.get(id) ?? []).slice(-5);
  }

  rowClass(pos: number): string {
    if (pos <= 4) return 'row-zone-a';
    if (pos <= 8) return 'row-zone-b';
    return '';
  }

  trendColor(updown: string | undefined): string {
    if (updown === 'fas fa-chevron-up')   return '#019700';
    if (updown === 'fas fa-chevron-down') return '#BE1501';
    return '#888';
  }
}
