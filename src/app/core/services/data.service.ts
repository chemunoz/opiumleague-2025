import { Injectable, signal, computed } from '@angular/core';
import dataJSON from '../../../../public/assets/data/data.json';
import { Player } from '../models';

interface JornadaTeam {
  id: number;
  team: string;
  shield: string;
  name: string;
  image: string;
  score_jornada: number;
  score_general: number;
  position_jornada?: number;
  position_general?: number;
}

interface ScoreEntry {
  name: string;
  team: string;
  image?: string;
  shield?: string;
  score: number;
}

interface JornadaTeamFull extends JornadaTeam {
  score_best?: number;
  score_worst?: number;
  score_average?: number;
  num_jornadas?: number;
  updown?: string;
  updown_num?: number;
}

type JornadaRecord = JornadaTeamFull[] & {
  score_best: ScoreEntry;
  score_worst: ScoreEntry;
  score_average: number;
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private playersData = signal<Player[]>([]);

  readonly players = this.playersData.asReadonly();

  readonly sortedPlayers = computed(() => {
    const cmp = (x: string, y: string) => (x > y ? 1 : x < y ? -1 : 0);
    return [...this.playersData()].sort((a, b) => cmp(a.team, b.team));
  });

  constructor() {
    console.log('Iniciando Service de Datos');
    this.loadPlayers();
  }

  private loadPlayers(): void {
    const data = JSON.parse(JSON.stringify(dataJSON)) as Player[];
    this.calculatePlayers(data);
    this.playersData.set(data);
  }

  private calculatePlayers(players: Player[]): void {
    const cmp = (x: number | string, y: number | string): number => {
      if (typeof x === 'string' && typeof y === 'string') {
        return x.localeCompare(y);
      }
      return x > y ? 1 : x < y ? -1 : 0;
    };

    const average = (...arr: number[]): number => {
      const tot = arr.reduce((sum, score) => sum + score, 0);
      return Math.round((tot / arr.length) * 100) / 100;
    };

    const calculateJornadas: Record<string, JornadaTeam[]> = {};

    players.forEach((player) => {
      player.score_general = 0;
      player.score_jornada = [];
      player.positions_jornada = [];
      player.positions_general = [];
      player.score_average_jornada = [];
      player.score_best = 0;
      player.score_worst = 0;
      player.score_average = 0;
      player.num_jornadas = 0;

      player.points
        .filter((value): value is number => value !== null)
        .forEach((score, index) => {
          player.score_general! += score;
          player.score_jornada!.push(player.score_general!);

          const jornadaKey = `jornada_${index + 1}`;
          if (!calculateJornadas[jornadaKey]) {
            calculateJornadas[jornadaKey] = [];
          }
          calculateJornadas[jornadaKey].push({
            id: player.id,
            team: player.team,
            shield: player.images.shield,
            name: player.name,
            image: player.images.profile,
            score_jornada: score,
            score_general: player.score_general!,
          });
        });
    });

    Object.keys(calculateJornadas).forEach((jornada) => {
      calculateJornadas[jornada].sort(
        (a, b) =>
          cmp(
            (a.score_jornada as unknown as number | string) >
              (b.score_jornada as unknown as number | string)
              ? -1
              : (a.score_jornada as unknown as number | string) <
                  (b.score_jornada as unknown as number | string)
                ? 1
                : 0,
            (b.score_jornada as unknown as number | string) >
              (a.score_jornada as unknown as number | string)
              ? -1
              : (b.score_jornada as unknown as number | string) <
                  (a.score_jornada as unknown as number | string)
                ? 1
                : 0,
          ) || cmp(a.team, b.team),
      );

      const pointsAverage: number[] = [];
      calculateJornadas[jornada].forEach((team, i) => {
        const player = players.find((p) => p.id === team.id);
        if (!player) return;

        if (
          i > 0 &&
          team.score_jornada === calculateJornadas[jornada][i - 1].score_jornada
        ) {
          team.position_jornada =
            calculateJornadas[jornada][i - 1].position_jornada;
        } else {
          team.position_jornada = i + 1;
        }

        player.positions_jornada!.push(team.position_jornada!);
        pointsAverage.push(team.score_jornada);

        const validPoints = player.points.filter(
          (v): v is number => v !== null,
        );
        player.score_best = Math.max(...validPoints);
        player.score_worst = Math.min(...validPoints);
        player.score_average = average(...validPoints);
        player.num_jornadas = validPoints.length;
      });
    });

    players.forEach((player) => {
      player.top_jornada =
        player.positions_jornada?.filter((v) => v === 1).length ?? 0;
      player.top_clasificacion =
        player.positions_general?.filter((v) => v === 1).length ?? 0;

      player.positions_general_differences =
        player.positions_general?.map((value, index) =>
          index === 0
            ? 0
            : (player.positions_general?.[index - 1] ?? 0) - value,
        ) ?? [];

      const diffs = player.positions_general_differences.filter(
        (v): v is number => !isNaN(v),
      );
      player.positions_general_differences_max =
        diffs.length === 0 ? 0 : Math.max(...diffs);
      player.positions_general_differences_min =
        diffs.length === 0 ? 0 : Math.abs(Math.min(...diffs));
    });
  }

  getPlayer(id: string | number): Player | undefined {
    const players = this.playersData();
    this.calculatePlayers(players);
    return players.find((x) => x.id === parseInt(String(id), 10));
  }

  readPlayers(): Player[] {
    const players = this.playersData();
    this.calculatePlayers(players);
    return players;
  }

  getJornadas(): Record<string, unknown> {
    const players = this.playersData();
    const cmp = (x: number | string, y: number | string): number => {
      if (typeof x === 'string' && typeof y === 'string') {
        return x.localeCompare(y);
      }
      return x > y ? 1 : x < y ? -1 : 0;
    };

    const average = (...arr: number[]): number => {
      const tot = arr.reduce((sum, score) => sum + score, 0);
      return Math.round((tot / arr.length) * 100) / 100;
    };

    const calculateJornadas: Record<string, JornadaRecord> = {};

    players.forEach((player) => {
      player.score_general = 0;
      player.score_jornada = [];
      player.positions_jornada = [];
      player.positions_general = [];

      player.points
        .filter((v): v is number => v !== null)
        .forEach((score, index) => {
          player.score_general! += score;
          player.score_jornada!.push(player.score_general!);

          const key = `jornada_${index + 1}`;
          if (!calculateJornadas[key]) {
            calculateJornadas[key] = [] as unknown as JornadaRecord;
          }
          calculateJornadas[key].push({
            id: player.id,
            team: player.team,
            shield: player.images.shield,
            name: player.name,
            image: player.images.profile,
            score_jornada: score,
            score_general: player.score_general!,
          });
        });
    });

    let countJornada = 0;
    const lastJornada = Object.keys(calculateJornadas).length || 0;
    const penultima: { id: number; team: string; position: number }[] = [];

    Object.keys(calculateJornadas).forEach((jornada) => {
      countJornada += 1;

      calculateJornadas[jornada].sort((a, b) => {
        const scoreDiff = cmp(b.score_jornada, a.score_jornada);
        if (scoreDiff !== 0) return scoreDiff;
        return cmp(a.team, b.team);
      });

      calculateJornadas[jornada].score_best = { name: '', team: '', score: 0 };
      calculateJornadas[jornada].score_worst = {
        name: '',
        team: '',
        score: 1000,
      };
      calculateJornadas[jornada].score_average = 0;
      calculateJornadas[jornada].name = `JORNADA ${countJornada}`;

      const pointsAverage: number[] = [];
      calculateJornadas[jornada].forEach((team, i) => {
        if (
          i > 0 &&
          team.score_jornada === calculateJornadas[jornada][i - 1].score_jornada
        ) {
          team.position_jornada =
            calculateJornadas[jornada][i - 1].position_jornada;
        } else {
          team.position_jornada = i + 1;
        }

        if (calculateJornadas[jornada].score_best.score < team.score_jornada) {
          calculateJornadas[jornada].score_best = {
            name: team.name,
            team: team.team,
            image: team.image,
            shield: team.shield,
            score: team.score_jornada,
          };
        }
        if (calculateJornadas[jornada].score_worst.score > team.score_jornada) {
          calculateJornadas[jornada].score_worst = {
            name: team.name,
            team: team.team,
            image: team.image,
            shield: team.shield,
            score: team.score_jornada,
          };
        }
        pointsAverage.push(team.score_jornada);

        const player = players.find((p) => p.id === team.id);
        if (player) {
          player.positions_jornada!.push(team.position_jornada!);
          const validPoints = player.points.filter(
            (v): v is number => v !== null,
          );
          team.score_best = Math.max(...validPoints);
          team.score_worst = Math.min(...validPoints);
          team.score_average = average(...validPoints);
          team.num_jornadas = validPoints.length;
        }
      });
      calculateJornadas[jornada].score_average = average(...pointsAverage);

      calculateJornadas[jornada].sort((a, b) => {
        const scoreDiff = cmp(b.score_general, a.score_general);
        if (scoreDiff !== 0) return scoreDiff;
        const bestDiff = cmp(
          (b.score_best ?? 0) - (b.score_worst ?? 0),
          (a.score_best ?? 0) - (a.score_worst ?? 0),
        );
        return bestDiff;
      });

      calculateJornadas[jornada].forEach((team, i) => {
        if (
          i > 0 &&
          team.score_general === calculateJornadas[jornada][i - 1].score_general
        ) {
          team.position_general =
            calculateJornadas[jornada][i - 1].position_general;
        } else {
          team.position_general = i + 1;
        }

        const player = players.find((p) => p.id === team.id);
        if (player) {
          player.positions_general!.push(team.position_general!);
        }

        if (countJornada + 1 === lastJornada) {
          penultima[i] = {
            id: team.id,
            team: team.team,
            position: team.position_general!,
          };
        }
        if (countJornada === lastJornada && lastJornada > 1) {
          const player2 = penultima.find((e) => e.id === team.id);
          if (player2) {
            if (player2.position > team.position_general!) {
              team.updown = 'fas fa-chevron-up';
            } else if (player2.position < team.position_general!) {
              team.updown = 'fas fa-chevron-down';
            } else {
              team.updown = 'fas fa-equals';
            }
            team.updown_num = Math.abs(
              player2.position - team.position_general!,
            );
          }
        } else {
          team.updown = 'fas fa-equals';
          team.updown_num = 0;
        }
      });
    });

    return calculateJornadas;
  }
}
