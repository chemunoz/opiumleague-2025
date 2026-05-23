import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from './layout/header/header.component';
import { MenuComponent } from './layout/menu/menu.component';

declare function gtag(...args: unknown[]): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  title = 'Opium League';

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        if (typeof gtag !== 'undefined') {
          gtag('config', 'UA-92241042-3', {
            page_path: event.urlAfterRedirects,
          });
        }
      });
  }
}
