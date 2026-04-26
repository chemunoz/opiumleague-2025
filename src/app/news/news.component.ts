import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    (<any>window).twttr = (function(d, s, id) {
      let js: any;
      const fjs = d.getElementsByTagName(s)[0];
      const t = (<any>window).twttr || {};
      if (d.getElementById(id)) { return t; }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://platform.twitter.com/widgets.js';
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }

      t._e = [];
      t.ready = function(f: any) {
        t._e.push(f);
      };

      return t;
    }(document, 'script', 'twitter-wjs'));
  }

}
