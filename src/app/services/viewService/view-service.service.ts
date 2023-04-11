import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ObjectData {
  _id: string;
  name: string;

}


@Injectable({
  providedIn: 'root'
})
export class ViewServiceService {

  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase +'/api/';
  api: string = "views";
  constructor(private http: HttpClient) { }

  CreateObj(equipmentObj: any) {
    const headerDict = {
      'Content-Type': 'application/json'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj);
    console.log(data);
    return this.http.post(this.baseUrl + this.api, data, requestOptions);

  }

  getAll(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      })
    };
    return this.http.get<any>(this.baseUrl+ this.api,options)
  }

  public get(url: string) {
    return this.http.get(url);
  }


  EditObj(Obj: any) {
    const headerDict = {
      'Content-Type': 'application/json'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(Obj);
    console.log(data);
    return this.http.patch(this.baseUrl + this.api, data, requestOptions);
  }

  deleteObj(Obj: any) {
    const data = JSON.stringify(Obj);
    const headerDict = {
      'Content-Type': 'application/json'
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete(this.baseUrl+ this.api, options);
  }
}
