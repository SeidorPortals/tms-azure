import { Component, OnInit } from '@angular/core';
import "@ui5/webcomponents-fiori/dist/ShellBarItem";
import "@ui5/webcomponents-icons/dist/menu.js";

@Component({
  selector: 'app-shellbar',
  templateUrl: './shellbar.component.html',
  styleUrls: ['./shellbar.component.css']
})
export class ShellbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  colapsar() {
    let sideNavigation = document.getElementById("side-navigation");
    if (sideNavigation.getAttribute('collapsed')) {
      sideNavigation.removeAttribute("collapsed");
    }
    else {
      sideNavigation.setAttribute("collapsed", "false");
    }
  }
  
  logout(){
    localStorage.removeItem('token');
    //this.router.navigateByUrl('/auth');
  }
}
