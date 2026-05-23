import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Player, TeamStanding } from '../../core/models';

@Component({
  selector: 'app-table-friends',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './table-friends.component.html',
  styleUrl: './table-friends.component.css',
})
export class TableFriendsComponent {
  tablePlayers: Player[] = [];
  tables: Record<string, TeamStanding[]>;
  sportFriends: number[] = [1, 29, 2, 0, 20, 34, 32, 12];
  general_table: TeamStanding[] = [];

  private servicio = inject(DataService);

  constructor() {
    const cmp = (x: number | number[], y: number | number[]) => {
      return x > y ? 1 : x < y ? -1 : 0;
    };

    this.tablePlayers = this.servicio
      .readPlayers()
      .filter((player) => this.sportFriends.includes(player['id']));
    console.log('PLAYERS', this.tablePlayers);

    this.tables = this.servicio.getJornadas() as unknown as Record<
      string,
      TeamStanding[]
    >;
    console.log('JORNADAS', this.tables);

    // CLASIFICACION ACTUAL (los datos YA vienen ordenados de lo anterior)
    if (Object.values(this.tables).length > 0) {
      this.general_table =
        this.tables[`jornada_${Object.values(this.tables).length - 3}`] ?? [];

      // Added 'positions_jornada' positions to calculate column 'Racha' in the view
      this.tablePlayers.forEach((player) => {
        if (this.sportFriends.includes(player['id'])) {
          const myplayer = this.general_table.filter((e) => e.id === player.id);
          if (myplayer[0] !== undefined) {
            if ((player.positions_jornada?.length ?? 0) > 5) {
              myplayer[0].positions_jornada = player.positions_jornada?.splice(
                (player.positions_jornada?.length ?? 0) - 5,
                5,
              );
            } else {
              myplayer[0].positions_jornada = player.positions_jornada;
            }
          }
        }
      });
      console.log('PLAYERS 2', this.tablePlayers);

      // SORT by GENERAL SCORE and then by BEST SCORE in season
      this.general_table = this.general_table.filter((player) =>
        this.sportFriends.includes(player['id']),
      );
      this.general_table.sort(function (a, b) {
        // note the minus before -cmp, for descending order
        return cmp(
          [
            -cmp(a.score_general, b.score_general),
            -cmp(a.score_best ?? 0, b.score_best ?? 0),
          ],
          [
            -cmp(b.score_general, a.score_general),
            -cmp(b.score_best ?? 0, a.score_best ?? 0),
          ],
        );
      });
      this.general_table.forEach((element, index) => {
        element.position_general = index + 1;
      });
      console.log('Ult. Clasificacion', this.general_table);
    }
  }
}
