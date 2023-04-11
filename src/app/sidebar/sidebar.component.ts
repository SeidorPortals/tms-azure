import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/trips',           title: 'Trips',            icon:'nc-diamond',    class: '' },
    { path: '/carriers',        title: 'Carriers',         icon:'nc-bank',       class: '' },
    { path: '/customers',      title: 'Customer',      icon:'nc-diamond',    class: '' },

    { path: '/drivers',         title: 'Drivers',          icon:'nc-diamond',    class: '' },
    { path: '/new-driver',      title: 'New Driver',       icon:'nc-diamond',    class: '' },
    { path: '/trucks',           title: 'Trucks',           icon:'nc-diamond',    class: '' },
    { path: '/truckowner',           title: 'Truck Owner',           icon:'nc-diamond',    class: '' },
    { path: '/trailers',           title: 'Trailer',           icon:'nc-diamond',    class: '' },
    { path: '/shippers',    title: 'Shippers',       icon:'nc-diamond',    class: ''},
    { path: '/consignee',           title: 'Consignee',           icon:'nc-diamond',    class: '' },
    { path: '/commodity',           title: 'Comodity',           icon:'nc-diamond',    class: '' },

    
];

@Component({
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}

