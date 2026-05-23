import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./table/table/table.component').then((m) => m.TableComponent),
  },
  {
    path: 'table-friends',
    loadComponent: () =>
      import('./table/table-friends/table-friends.component').then(
        (m) => m.TableFriendsComponent,
      ),
  },
  {
    path: 'charts',
    loadComponent: () =>
      import('./charts/charts.component').then((m) => m.ChartsComponent),
  },
  {
    path: 'competitions',
    loadComponent: () =>
      import('./competitions/competitions/competitions.component').then(
        (m) => m.CompetitionsComponent,
      ),
  },
  {
    path: 'cup',
    loadComponent: () =>
      import('./competitions/cup/cup.component').then((m) => m.CupComponent),
  },
  {
    path: 'champions',
    loadComponent: () =>
      import('./competitions/champions/champions.component').then(
        (m) => m.ChampionsComponent,
      ),
  },
  {
    path: 'uefa',
    loadComponent: () =>
      import('./competitions/uefa/uefa.component').then((m) => m.UefaComponent),
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'rules',
    loadComponent: () =>
      import('./rules/rules.component').then((m) => m.RulesComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./gallery/gallery/gallery.component').then(
        (m) => m.GalleryComponent,
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history.component').then((m) => m.HistoryComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./gallery/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'supercup-europa',
    loadComponent: () =>
      import('./competitions/supercup-europa/supercup-europa.component').then(
        (m) => m.SupercupEuropaComponent,
      ),
  },
  {
    path: 'supercup-spain',
    loadComponent: () =>
      import('./competitions/supercup-spain/supercup-spain.component').then(
        (m) => m.SupercupSpainComponent,
      ),
  },
  {
    path: 'supercup-opium',
    loadComponent: () =>
      import('./competitions/supercup-opium/supercup-opium.component').then(
        (m) => m.SupercupOpiumComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
