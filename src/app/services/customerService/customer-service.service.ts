import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Observable, of, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ValidatorService } from '../validator/validator.service';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
import { environment } from 'src/environments/environment';

export interface ObjectData {
  _id: string;
  name: string;

}

@Injectable({
  providedIn: 'root'
})

export class CustomerServiceService {
  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase +'/api/customer';
  baseCustomerUrl: string = this.serbase +'/api/wsdl/CCUSTOMER';
  constructor(private http: HttpClient, private vs: ValidatorService) { }
  
  replacer(key, value) {
    // Filtering out properties
    if (value === null) {
      return "";
    }
    return value;
  }

  CreateObj(equipmentObj: any) {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': ''+ localStorage.getItem('token')+''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj, this.replacer, "\t");
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
          response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
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
    const data = JSON.stringify(Obj, this.replacer, "\t");
    //console.log(data);
    return this.http.patch(this.baseUrl , data, requestOptions)
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
          response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
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
  
  ////////Service to create Cusomters in BYD (calling WSDL)
  CreateObjCustomer(modelo: any): Observable<any> {
    const headerDict = {
      'Content-Type': 'application/json',
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(modelo);
    console.log(data);
    return this.http.put(this.baseCustomerUrl, data, requestOptions)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        console.log(error);
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
        //console.log(resp);
        if(resp != null && !resp.hasOwnProperty('success')){
          if(resp.message != null){
            let respMessage: any = null;
            if(resp.message != null && Array.isArray(resp.message) && resp.message.length == 1)
            {
              respMessage = resp.message[0];
              //console.log("array");
            }else if(resp.message)
            {
              respMessage = resp.message;
              //console.log("Single");
            }
            //console.log(respMessage);
            if(respMessage.hasOwnProperty('MaximumLogItemSeverityCode')){
              //console.log(resp);
              let itemError = resp['Item'][0];
              let messageError = itemError != null ? itemError['Note'][0] : '';

              let response: ResponseHelper = {
                success: false,
                message: messageError,
                code: 0
              }
              return response;
            }else if(respMessage.hasOwnProperty('n0:CustomerBundleMaintainConfirmation_sync_V1')){
              let CustomerObj = respMessage["n0:CustomerBundleMaintainConfirmation_sync_V1"] != null 
              && respMessage["n0:CustomerBundleMaintainConfirmation_sync_V1"].length == 1 ? respMessage["n0:CustomerBundleMaintainConfirmation_sync_V1"][0] : null;
              
              let customer = CustomerObj["Customer"] != null 
              && CustomerObj["Customer"].length == 1 ? CustomerObj["Customer"][0] : null;

              let customerID = customer["InternalID"] != null && customer["InternalID"].length == 1 ? customer["InternalID"][0] : null;
              let customerUUID = customer["UUID"] != null && customer["UUID"].length == 1 ? customer["UUID"][0] : null;
              //console.log(supplierID +" - " + supplierUUID);
              let response: ResponseHelper = {
                success: true,
                message: 'Your work has been saved',
                code: 0,
                helper: {
                  CUSTOMER: customerID,
                  CUSTOMERUUID: customerUUID,
                }
              }
              return response;
            }else{
              //console.log(resp);
              let response:ResponseHelper = {
                success: false,
                message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
                code: 0
              }
              return response;
            }
          }else{
            //console.log(resp);
            let response:ResponseHelper = {
              success: false,
              message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
              code: 0
            }
            return response;
          }
        }
        return resp;
      })
    );
    
  }
  
  CreateAttachments(form: any): Observable<ResponseHelper>{    
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data',
    //     'x-token': ''+ localStorage.getItem('token')+''
    //   })
    // }

    const body = new FormData();
    body.append('archivo', form.fileRaw, form.fileName);
    body.append('objectid',form.ID);
    return this.http.put(this.baseUrl + '/upload', body)
    .pipe(  
      //manejo de errores
      timeout(this.vs.waitTime), //tiempo de espera
      catchError((error: HttpErrorResponse | TimeoutError) => {
        console.log(error);
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
        if(resp != null && !resp.hasOwnProperty('success')){
          if(resp.hasOwnProperty('name')){
            let response: ResponseHelper = {
              success: true,
              message: resp['message'] != null ? resp['message'] : "",
              code: 200,
              helper: {
                name: resp['name'],
                url: resp['url'],
              }
            };
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
