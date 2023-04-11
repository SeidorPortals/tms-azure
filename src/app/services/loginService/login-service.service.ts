import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class LoginServiceService {
  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase +'/api/';
  servURL: string = this.serbase +'/api/auth/login';
  constructor(private http: HttpClient) { }

  addUsers(userObj: any) {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const data = JSON.stringify(userObj);
    console.log(data);
    return this.http.post(this.baseUrl + 'users', data, requestOptions);

  }

  getUsers() {

    return this.http.get(this.baseUrl + 'users');
  }

  tryLogin(user: any) {

    return new Promise((resolve, reject) => {
      const body = {
        "email": user.email,
        "password": user.password,
      }
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-token': ''+ localStorage.getItem('token')+''
        }),
        body: body,
      };

      this.http.post(this.serbase +`/api/auth/login`, options).subscribe(
        async (res: any) => {

          console.log('RES', res);

          let hoy = new Date();
          hoy.setSeconds(3600);
          await this.saveData(res, hoy);
          resolve("resolve");

        }, err => {
          resolve("resolve");
          console.log('error', err.error.error.error);
          // resolve(genericResponse);
        }
      )
    })
  }

  private saveData(res: any, hoy: any): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      localStorage.setItem('expira', hoy.getTime().toString());
      localStorage.setItem('email', res.payload.email);
      localStorage.setItem('token', res.payload.idToken);
      localStorage.setItem('X_TOKEN', res.payload.idToken);
      localStorage.setItem('err', res.payload.error);
      resolve(true);
    })

  }

  Auth(authObj: any) {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(authObj);
    //console.log(data);
    return this.http.post(this.servURL, data, requestOptions);

  }
}
