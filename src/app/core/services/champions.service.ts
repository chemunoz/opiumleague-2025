import { Injectable, signal, computed } from '@angular/core';
import championsJSON from '../../../../public/assets/data/champions.json';
import { ChampionsGroup, ChampionsRound, ChampionsCountdown } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChampionsService {
  private championsData = signal<{ groups: ChampionsGroup[]; rounds: ChampionsRound[]; countdowns: ChampionsCountdown[] }>(championsJSON as any);

  readonly groups = computed(() => this.championsData().groups);
  readonly rounds = computed(() => this.championsData().rounds);
  readonly countdowns = computed(() => this.championsData().countdowns);

  constructor() {
    console.log('Iniciando Service de Champions');
  }

  getGroups(): ChampionsGroup[] {
    return this.championsData().groups;
  }

  getRounds(): ChampionsRound[] {
    return this.championsData().rounds;
  }

  getCountdowns(): ChampionsCountdown[] {
    return this.championsData().countdowns;
  }
}
