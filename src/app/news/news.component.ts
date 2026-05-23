import { Component, AfterViewInit } from '@angular/core';

interface TwitterObj {
  _e: (() => void)[];
  ready: (f: () => void) => void;
}

type TwitterWindow = Window & { twttr?: TwitterObj };

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements AfterViewInit {
  ngAfterViewInit() {
    const w = window as TwitterWindow;
    w.twttr = (function (d: Document, s: string, id: string) {
      const fjs = d.getElementsByTagName(s)[0];
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const t: TwitterObj = w.twttr ?? { _e: [], ready: () => {} };
      if (d.getElementById(id)) {
        return t;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://platform.twitter.com/widgets.js';
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }

      t._e = [];
      t.ready = function (f: () => void) {
        t._e.push(f);
      };

      return t;
    })(document, 'script', 'twitter-wjs');
  }
}
