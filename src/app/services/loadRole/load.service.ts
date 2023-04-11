import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoadService {
  serbase: string = environment.URL_BASE;
  constructor(  private http: HttpClient, 
                private ps: NgxPermissionsService,
                private title: Title, 
                private rolesService: NgxRolesService ){}

  private baseUrl: string = this.serbase +'/api/role';

  load() { }

  getRoles(){
    return new Promise( (resolve, reject) => {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': ''+ localStorage.getItem('token')+''
        })
      };

      //get list of roles
        this.http.get<any[]>(this.baseUrl,options).subscribe(data => {
          
          if(data.length > 0){
            data.forEach(item=> {
              this.rolesService.addRole(item.ROLE_ID, item.ROLE_NAME);
              //console.log(item.ROLE_ID);
            });
          }
          
          // //set default user roles
           let list: string[] = [];
           this.ps.loadPermissions(list);
        });
      resolve(true);
    });
  }
}
