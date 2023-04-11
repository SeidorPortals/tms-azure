import { Component, OnInit } from '@angular/core';
import "@ui5/webcomponents-fiori/dist/SideNavigation.js";
import "@ui5/webcomponents-fiori/dist/SideNavigationItem.js"; //(for ui5-side-navigation-item)
import "@ui5/webcomponents-fiori/dist/SideNavigationSubItem.js"; //(for ui5-side-navigation-sub-item)
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/travel-request.js";
import "@ui5/webcomponents-icons/dist/supplier.js";
import "@ui5/webcomponents-icons/dist/action-settings.js";
import "@ui5/webcomponents-icons/dist/crm-sales.js";
import "@ui5/webcomponents-icons/dist/bus-public-transport.js";
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private router: Router,private ps: NgxPermissionsService, ) { }

  ngOnInit(): void {
  }

  colapsar() {
    let sideNavigation = document.getElementById("side-navigation");
    if (sideNavigation.getAttribute('collapsed')) {
      sideNavigation.setAttribute("collapsed", "false");
    }
    else {
      sideNavigation.setAttribute("collapsed", "false");
    }
  }

  logout()
  {
    this.ps.flushPermissions();
    this.router.navigate(['/login']);
    
  }

}
