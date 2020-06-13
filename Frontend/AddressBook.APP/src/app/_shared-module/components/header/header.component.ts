import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentRoute = "";

  constructor(private router: Router) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.currentRoute = route.url;
        if (this.currentRoute && this.currentRoute.length > 0) {
          this.currentRoute = this.currentRoute.slice(1);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  

  

}
