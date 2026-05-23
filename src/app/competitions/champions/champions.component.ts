import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  OnDestroy,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ChampionsService } from '../../core/services/champions.service';
import {
  Player,
  ChampionsGroup,
  ChampionsRound,
  ChampionsCountdown,
} from '../../core/models';

interface ChampionsTable {
  table: TeamData[];
  rounds: MatchRound[];
}

interface TeamData {
  id: number;
  score: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  pf: number;
  pc: number;
  dif: number;
  max: number;
}

interface MatchRound {
  match1: TeamMatch[];
  match2: TeamMatch[];
}

interface TeamMatch {
  id: number;
  score: number | null;
}

@Component({
  selector: 'app-champions',
  standalone: true,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './champions.component.html',
  styleUrl: './champions.component.css',
})
export class ChampionsComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private championsService = inject(ChampionsService);

  readonly championsCountdowns = signal<ChampionsCountdown[]>([]);
  readonly championsRounds = signal<ChampionsRound[]>([]);
  readonly championsGroups = signal<ChampionsGroup[]>([]);
  readonly players = signal<Player[]>([]);
  readonly championsTables = signal<Record<string, ChampionsTable>>({});

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  private readonly championsGroupsSchedule = [
    { match1: [0, 1], match2: [2, 3] },
    { match1: [3, 0], match2: [1, 2] },
    { match1: [2, 0], match2: [3, 1] },
    { match1: [0, 2], match2: [1, 3] },
    { match1: [1, 0], match2: [3, 2] },
    { match1: [2, 1], match2: [0, 3] },
  ];

  ngOnInit() {
    this.championsCountdowns.set(this.championsService.getCountdowns());
    this.championsGroups.set(this.championsService.getGroups());
    this.championsRounds.set(this.championsService.getRounds());
    this.players.set(this.dataService.players());

    this.calculateTables();
    this.startCountdowns();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdowns(): void {
    const competitions: (ChampionsCountdown | null)[] = [
      ...this.championsCountdowns(),
    ];

    const updateCountdowns = () => {
      const now = new Date().getTime();

      competitions.forEach((competition, i) => {
        if (!competition) return;

        const countDownDate = new Date(competition.deadline).getTime();
        const distance = countDownDate - now;

        let text: string;

        if (distance < 0) {
          text = 'COMENZADA!!';
          competitions[i] = null;
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
        if (el) {
          el.textContent = text;
        }
      });
    };

    this.countdownInterval = setInterval(updateCountdowns, 1000);
  }

  private calculateTables(): void {
    const cmp = (x: number, y: number) => (x > y ? 1 : x < y ? -1 : 0);
    const playersArray = this.players();
    const groups = this.championsGroups();
    const rounds = this.championsRounds();

    const tables: Record<string, ChampionsTable> = {};

    groups.forEach((group) => {
      tables[group.name] = {
        table: [],
        rounds: [],
      };

      group.teams.forEach((teamId) => {
        tables[group.name].table.push({
          id: teamId,
          score: 0,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          pf: 0,
          pc: 0,
          dif: 0,
          max: 0,
        });
      });

      this.calculateRoundsForGroup(
        tables[group.name],
        group,
        rounds,
        playersArray,
      );

      tables[group.name].table.sort((a, b) => {
        const scoreDiff = cmp(b.score, a.score);
        if (scoreDiff !== 0) return scoreDiff;
        const difDiff = cmp(b.dif, a.dif);
        if (difDiff !== 0) return difDiff;
        return cmp(b.max, a.max);
      });
    });

    this.championsTables.set(tables);
  }

  private calculateRoundsForGroup(
    table: ChampionsTable,
    group: ChampionsGroup,
    rounds: ChampionsRound[],
    players: Player[],
  ): void {
    rounds.forEach((championsRound, index) => {
      const player0 = players.find((p) => p.id === group.teams[0]);
      if (!player0 || player0.points[championsRound.round] === null) return;

      const partido1 = {
        home: group.teams[this.championsGroupsSchedule[index].match1[0]],
        away: group.teams[this.championsGroupsSchedule[index].match1[1]],
      };
      const partido2 = {
        home: group.teams[this.championsGroupsSchedule[index].match2[0]],
        away: group.teams[this.championsGroupsSchedule[index].match2[1]],
      };

      const home1 = players.find((p) => p.id === partido1.home);
      const away1 = players.find((p) => p.id === partido1.away);
      const home2 = players.find((p) => p.id === partido2.home);
      const away2 = players.find((p) => p.id === partido2.away);

      table.rounds.push({
        match1: [
          {
            id: partido1.home,
            score: home1?.points[championsRound.round] ?? null,
          },
          {
            id: partido1.away,
            score: away1?.points[championsRound.round] ?? null,
          },
        ],
        match2: [
          {
            id: partido2.home,
            score: home2?.points[championsRound.round] ?? null,
          },
          {
            id: partido2.away,
            score: away2?.points[championsRound.round] ?? null,
          },
        ],
      });

      const team1 = table.table.find((t) => t.id === partido1.home);
      const team2 = table.table.find((t) => t.id === partido1.away);
      const team3 = table.table.find((t) => t.id === partido2.home);
      const team4 = table.table.find((t) => t.id === partido2.away);

      [team1, team2, team3, team4].forEach((team) => {
        if (!team) return;

        team.pj += 1;
        const matchIndex = index;

        if (matchIndex === 0 || matchIndex === 2) {
          const homeTeam = matchIndex === 0 ? home1 : home2;
          const awayTeam = matchIndex === 0 ? away1 : away2;
          if (homeTeam && awayTeam) {
            const homeScore = homeTeam.points[championsRound.round] ?? 0;
            const awayScore = awayTeam.points[championsRound.round] ?? 0;

            team.pf += homeScore;
            team.pc += -awayScore;
            team.max = Math.max(team.max, homeScore);

            if (Math.abs(homeScore) > Math.abs(awayScore)) {
              team.score += 3;
              team.pg += 1;
            } else if (Math.abs(homeScore) === Math.abs(awayScore)) {
              team.score += 1;
              team.pe += 1;
            } else {
              team.pp += 1;
            }
          }
        } else {
          const homeTeam = matchIndex === 1 ? away1 : away2;
          const awayTeam = matchIndex === 1 ? home1 : home2;
          if (homeTeam && awayTeam) {
            const homeScore = homeTeam.points[championsRound.round] ?? 0;
            const awayScore = awayTeam.points[championsRound.round] ?? 0;

            team.pf += homeScore;
            team.pc += -awayScore;
            team.max = Math.max(team.max, homeScore);

            if (Math.abs(homeScore) > Math.abs(awayScore)) {
              team.score += 3;
              team.pg += 1;
            } else if (Math.abs(homeScore) === Math.abs(awayScore)) {
              team.score += 1;
              team.pe += 1;
            } else {
              team.pp += 1;
            }
          }
        }

        team.dif = team.pf + team.pc;
      });
    });
  }

  getPlayerName(id: number): string {
    const player = this.players().find((p) => p.id === id);
    return player?.name || '';
  }

  getPlayerTeam(id: number): string {
    const player = this.players().find((p) => p.id === id);
    return player?.team || '';
  }

  getPlayerImage(id: number): string {
    const player = this.players().find((p) => p.id === id);
    return player?.images?.profile || '';
  }

  getPlayerShield(id: number): string {
    const player = this.players().find((p) => p.id === id);
    return player?.images?.shield || '';
  }
}
