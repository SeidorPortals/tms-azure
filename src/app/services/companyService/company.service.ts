import { HttpClient, HttpHeaders, HttpParamsOptions, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase +'/api/company';
  constructor(private http: HttpClient) { }

  CreateObj(equipmentObj: any): Observable<any>  {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj);
    //console.log(data);
    return this.http.post(this.baseUrl, data, requestOptions);
  }

  getBy(params: any): any{
    let modelo: HttpParamsOptions = {
      fromObject: params,
    }
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      }),
      params: new HttpParams(modelo),
    }

    return this.http.get(this.baseUrl, options);
  }

  getAll(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      })
    };
    return this.http.get<any>(this.baseUrl,options)
  }

  public get(url: string) {
    return this.http.get(url);
  }


  EditObj(Obj: any) {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(Obj);
    //console.log(data);
    return this.http.patch(this.baseUrl, data, requestOptions);
  }

  deleteObj(Obj: any) {
    const data = JSON.stringify(Obj);
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      }),
      body: data,
    };
    return this.http.delete(this.baseUrl, options);
  }
}
