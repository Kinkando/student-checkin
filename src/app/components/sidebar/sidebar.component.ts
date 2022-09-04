import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public isActive: boolean = false;

  constructor(private _router : Router) {  }

  sidebars: Sidebar[] = [
    {
      header: "การเข้าออก",
      items: [
        {
          icon: "bi bi-card-checklist",
          text: "เช็คชื่อนักเรียน",
          routerLink: "/student"
        },
      ]
    },
  ];

  ngOnInit(): void {

  }

  get currentPage(): string {
    return this._router.url;
  }

  public setActive(isActive: boolean) {
    this.isActive = isActive;
  }
}

type Sidebar = {
  header: string,
  items: {
      icon: string,
      text: string,
      routerLink: string
  }[]
}