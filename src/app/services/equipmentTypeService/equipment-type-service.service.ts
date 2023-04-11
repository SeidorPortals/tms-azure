import { Injectable } from '@angular/core';
import { Observable, of, TimeoutError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { ValidatorService } from '../validator/validator.service';
import { catchError, map, timeout } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class EquipmentTypeServiceService {
  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase +'/api/EquipmentType';
  constructor(private http: HttpClient, private vs: ValidatorService) { }

  CreateObj(equipmentObj: any) {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj);
    //console.log(data);
    return this.http.post(this.baseUrl, data, requestOptions)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
        let response: ResponseHelper = {
          success: false,
          message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
          code: 0
        }
        if(error.name === 'HttpErrorResponse'){
          let message = this.vs.getMessageError(error['status']);
          if(message != null){
            response.message = message;
            response.code = error['status'];
          }
          if(error['error'] != null &&  typeof error['error'].message === 'string' && error['error'].message != null ){
            response.message = response.message + `<br> ${error['error'].message}`; 
          }
        }else{
          response.success = false;
          response.message = "The request has timed out. Try again, if the problem persists, contact yout admin.";
          response.code =  408;
        }
        return of(response);
      }),
      //manejo de respuesta
      map( (resp: any) => {
        if(resp != null && !resp.hasOwnProperty('success')){
          if(resp.message != null && typeof resp.message === 'string'){
            let response:ResponseHelper = {
              success: true,
              message: resp['message'] != null ? resp['message'] : "",
              code: 200
            }
            return response;
          }else{
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 257
            }
            return response;
          }
        }
        return resp;
      })
    );
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
    return this.http.patch(this.baseUrl, data, requestOptions)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
        let response: ResponseHelper = {
          success: false,
          message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
          code: 0
        }
        if(error.name === 'HttpErrorResponse'){
          let message = this.vs.getMessageError(error['status']);
          if(message != null){
            response.message = message;
            response.code = error['status'];
          }
          if(error['error'] != null &&  typeof error['error'].message === 'string' && error['error'].message != null ){
            response.message = response.message + `<br> ${error['error'].message}`; 
          }
        }else{
          response.success = false;
          response.message = "The request has timed out. Try again, if the problem persists, contact yout admin.";
          response.code =  408;
        }
        return of(response);
      }),
      //manejo de respuesta
      map( (resp: any) => {
        if(resp != null && !resp.hasOwnProperty('success')){
          if(resp.message != null && typeof resp.message === 'string'){
            let response:ResponseHelper = {
              success: true,
              message: resp['message'] != null ? resp['message'] : "",
              code: 200
            }
            return response;
          }else{
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 257
            }
            return response;
          }
        }
        return resp;
      })
    );
  }

  deleteObj(Obj: any) {
    const data = JSON.stringify(Obj);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      }),
      body: data,
    };
    return this.http.delete(this.baseUrl, options)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
        let response: ResponseHelper = {
          success: false,
          message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
          code: 0
        }
        if(error.name === 'HttpErrorResponse'){
          let message = this.vs.getMessageError(error['status']);
          if(message != null){
            response.message = message;
            response.code = error['status'];
          }
          if(error['error'] != null &&  typeof error['error'].message === 'string' && error['error'].message != null ){
            response.message = response.message + `<br> ${error['error'].message}`; 
          }
        }else{
          response.success = false;
          response.message = "The request has timed out. Try again, if the problem persists, contact yout admin.";
          response.code =  408;
        }
        return of(response);
      }),
      //manejo de respuesta
      map( (resp: any) => {
        if(resp != null && !resp.hasOwnProperty('success')){
          if(resp.message != null && typeof resp.message === 'string'){
            let response:ResponseHelper = {
              success: true,
              message: resp['message'] != null ? resp['message'] : "",
              code: 200
            }
            return response;
          }else{
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 257
            }
            return response;
          }
        }
        return resp;
      })
    );
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

    return this.http.get(this.baseUrl, options)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
        let response: ResponseHelper = {
          success: false,
          message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
          code: 0
        }
        if(error.name === 'HttpErrorResponse'){
          let message = this.vs.getMessageError(error['status']);
          if(message != null){
            response.message = message;
            response.code = error['status'];
          }
          if(error['error'] != null &&  typeof error['error'].message === 'string' && error['error'].message != null ){
            response.message = response.message + `<br> ${error['error'].message}`; 
          }
        }else{
          response.success = false;
          response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
          response.code =  408;
        }
        return of(response);
      }),
      //manejo de respuesta
      map( (resp: any) => {
        if(!Array.isArray(resp)){
          if(resp != null && typeof resp.message === 'string'){
            let response:ResponseHelper = {
              success: false,
              message: resp['message'] != null ? resp['message'] : "",
              code: resp.code
            }
            return response;
          }else{
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 257
            }
            return response;
          }
        }
        return resp;
      })
    );
  }

  getAll(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': ''+ localStorage.getItem('token')+''
      })
    };
    return this.http.get<any>(this.baseUrl,options)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        //console.log(error);
        let response: ResponseHelper = {
          success: false,
          message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
          code: 0
        }
        if(error.name === 'HttpErrorResponse'){
          let message = this.vs.getMessageError(error['status']);
          if(message != null){
            response.message = message;
            response.code = error['status'];
          }
          if(error['error'] != null &&  typeof error['error'].message === 'string' && error['error'].message != null ){
            response.message = response.message + `<br> ${error['error'].message}`; 
          }
        }else{
          response.success = false;
          response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
          response.code =  408;
        }
        return of(response);
      }),
      //manejo de respuesta
      map( (resp: any) => {
        if(!Array.isArray(resp)){
          if(resp != null && typeof resp.message === 'string'){
            let response:ResponseHelper = {
              success: false,
              message: resp['message'] != null ? resp['message'] : "",
              code: resp.code
            }
            return response;
          }else{
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 257
            }
            return response;
          }
        }
        return resp;
      })
    );
  }

}

  // listEquipments() {
  //   return this.http.get(this.baseUrl + 'EquipmentType')

  // }


//   deleteEquipments(equipmentObj: any) {
//     const data = JSON.stringify(equipmentObj);
//     const headerDict = {
//       'Content-Type': 'application/json'
//     }
//     const requestOptions = {
//       headers: new HttpHeaders(headerDict),
//     };

//     const options = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       }),
//       body: data,
//     };
//     return this.http.delete(this.baseUrl + 'EquipmentType', options);
//   }


//   addEquipments(equipmentObj: any) {
//     const headerDict = {
//       'Content-Type': 'application/json'
//     }
//     const requestOptions = {
//       headers: new HttpHeaders(headerDict),
//     };
//     const data = JSON.stringify(equipmentObj);
//     return this.http.post(this.baseUrl + 'EquipmentType', data, requestOptions);

//   }

//   EditEquipments(equipmentObj: any) {
//     const headerDict = {
//       'Content-Type': 'application/json'
//     }
//     const requestOptions = {
//       headers: new HttpHeaders(headerDict),
//     };
//     const data = JSON.stringify(equipmentObj);
//     //console.log(data);
//   return this.http.patch(this.baseUrl + 'EquipmentType', data, requestOptions);
// }

//    getEquipments() {
//      return this.http.get(this.baseUrl + 'EquipmentType').pipe(
//       map(this.crearArreglo)
//     );
//    }




//   private crearArreglo(equipObj: object) {
//     const equipments = [];

//     if (equipObj === null) {
//       return [];
//     }
//     else {


//       Object.keys(equipObj).forEach(key => {
//         if (equipObj[key] != null) {
//           const equipment = equipObj[key];
//           equipment.id = key;
//           equipments.push(equipment);
//         }
//       })
//       //console.log(clients);
//       return equipments;
//     }

//   }



  // deleteEquipments(EQUIPMENTTYPEID: any) {
  //   const headerDict = {
  //     'Content-Type': 'application/json'
  //   }
  //   const data = JSON.stringify(EQUIPMENTTYPEID);
  //   const requestOptions = {
      
  //     headers: new HttpHeaders(headerDict),
  //   };
    
  //   return this.http.delete(this.baseUrl + 'EquipmentType', data, requestOptions);
  //   //return this.http.delete(`${this.baseUrl}/EquipmentType/${id}`);

  // }








  // addNewEquipmentType(equipmenttype: string): Observable<EquipmentType> {

  //   const body = { name: equipmenttype };
  //   return this.http.post<EquipmentType>(this.baseUrl, body);

  // }



  // getAll(): Observable<any> {
  //   return this.http.get<any>('/api/EquipmentType')
  // }

  // public get(url: string) {
  //   return this.http.get(url);


  // }



  // createNewEquipmentType(data: any): Observable<any> {

  //   return this.http.post(`${this.baseUrl}`, data);

  // }

