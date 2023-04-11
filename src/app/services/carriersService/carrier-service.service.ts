import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Observable, of, TimeoutError } from 'rxjs';
import { ValidatorService } from '../validator/validator.service';
import { catchError, map, timeout } from 'rxjs/operators';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrierServiceService {

  serbase: string = environment.URL_BASE;

  baseUrl: string = this.serbase +'/api/carrier';
  baseProveedorUrl: string = this.serbase +'/api/wsdl/CSUPPLIER';
  baseUrlDelete: string = this.serbase +"/api/attachment/document";
  
  constructor(private http: HttpClient, private vs: ValidatorService, private datePipe: DatePipe,) { }

  replacer(key, value) {
    // Filtering out properties
    if (value === null) {
      return "";
    }
    return value;
  }

  CreateObj(equipmentObj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj, this.replacer, "\t");
    console.log(data);
    return this.http.post(this.baseUrl, data, requestOptions)
      .pipe(
        //manejo de errores
        timeout(this.vs.waitTime), //tiempo de espera
        catchError((error: HttpErrorResponse | TimeoutError) => {
          // console.log(error.error[0].code);
          let response: ResponseHelper = {
            success: false,
            message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
            code: 0
          }
          if (error.name === 'HttpErrorResponse') {
            // console.log(error['error'].code);
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.message != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: true,
                message: resp['message'] != null ? resp['message'] : "",
                code: 200
              }
              return response;
            } else {
              let response: ResponseHelper = {
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

  // CreateObj(equipmentObj: any): Observable<ResponseHelper> {
  //   const headerDict = {
  //     'Content-Type': 'application/json',
  //     'x-token': '' + localStorage.getItem('token') + ''
  //   }
  //   const requestOptions = {
  //     headers: new HttpHeaders(headerDict),
  //   };
  //   const data = JSON.stringify(equipmentObj, this.replacer, "\t");
  //   console.log(data);
  //   let response: ResponseHelper = {
  //     success: false,
  //     message: "UNIDENTIFIED ERROR <br>. contact admin, please.",
  //     code: 0
  //   }
  //   this.http.post(this.baseUrl, data, requestOptions).subscribe(info => {
  //     console.log(info);
  //     response.success = true;
  //     response.message = info['message'] != null ? info['message'] : "";
  //     response.code = 200;
  //   }, err => {
  //     // Entra aquí si el servicio entrega un código http de error EJ: 404, 
  //     //500
  //     console.log(err)
  //     console.log('status ', err.status);
  //     console.log('Hana code ', err.error.code);
  //     response.success = false;
  //     response.message = err['message'] != null ? err['message'] : "";
  //     response.code = err.error.code;
  //   })

  //   return of(response);

  // }


  EditObj(Obj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(Obj, this.replacer, "\t");
    console.log(data);
    return this.http.patch(this.baseUrl, data, requestOptions)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.message != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: true,
                message: resp['message'] != null ? resp['message'] : "",
                code: 200
              }
              return response;
            } else {
              let response: ResponseHelper = {
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

  deleteObj(Obj: any): Observable<ResponseHelper> {
    const data = JSON.stringify(Obj);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': '' + localStorage.getItem('token') + ''
      }),
      body: data,
    };
    return this.http.delete(this.baseUrl, options)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.message != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: true,
                message: resp['message'] != null ? resp['message'] : "",
                code: 200
              }
              return response;
            } else {
              let response: ResponseHelper = {
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

  CreateAttachments(form: any): Observable<ResponseHelper> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data',
    //     'x-token': ''+ localStorage.getItem('token')+''
    //   })
    // }

    const body = new FormData();
    body.append('archivo', form.fileRaw, form.fileName);
    body.append('objectid', form.ID);
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.hasOwnProperty('name')) {
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
            } else {
              let response: ResponseHelper = {
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

  deleteAttachment(idDocument: string, idObject: string, type: number): Observable<ResponseHelper> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': '' + localStorage.getItem('token') + ''
      }),
    };

    return this.http.delete(this.baseUrlDelete + `?ATTACHMENTID=${idDocument}&OBJECTID=${idObject}&TYPE=${type}`)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.message != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: true,
                message: resp['message'] != null ? resp['message'] : "",
                code: 200
              }
              return response;
            } else {
              let response: ResponseHelper = {
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

  getBy(params: any): Observable<any> {
    let modelo: HttpParamsOptions = {
      fromObject: params,
    }
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams(modelo),
    }

    return this.http.get(this.baseUrl, options)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (!Array.isArray(resp)) {
            if (resp != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: false,
                message: resp['message'] != null ? resp['message'] : "",
                code: resp.code
              }
              return response;
            } else {
              let response: ResponseHelper = {
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
        'x-token': '' + localStorage.getItem('token') + ''
      })
    };
    return this.http.get<any>(this.baseUrl, options)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          if (!Array.isArray(resp)) {
            if (resp != null && typeof resp.message === 'string') {
              let response: ResponseHelper = {
                success: false,
                message: resp['message'] != null ? resp['message'] : "",
                code: resp.code
              }
              return response;
            } else {
              let response: ResponseHelper = {
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

  CreateObjProveedor(modelo: any): Observable<any> {
    const headerDict = {
      'Content-Type': 'application/json',
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(modelo);
    console.log(data);
    return this.http.put(this.baseProveedorUrl, data, requestOptions)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            }
          } else {
            response.success = false;
            response.message = "The request has timed out. Try again, if the problem persists, contact your admin.";
            response.code = 408;
          }
          return of(response);
        }),
        //manejo de respuesta
        map((resp: any) => {
          //console.log(resp);
          if (resp != null && !resp.hasOwnProperty('success')) {
            if (resp.message != null) {
              let respMessage: any = null;
              if (resp.message != null && Array.isArray(resp.message) && resp.message.length == 1) {
                respMessage = resp.message[0];
                //console.log("array");
              } else if (resp.message) {
                respMessage = resp.message;
                //console.log("Single");
              }
              //console.log(respMessage);
              if (respMessage.hasOwnProperty('MaximumLogItemSeverityCode')) {
                //console.log(resp);
                let itemError = resp['Item'][0];
                let messageError = itemError != null ? itemError['Note'][0] : '';

                let response: ResponseHelper = {
                  success: false,
                  message: messageError,
                  code: 0
                }
                return response;
              } else if (respMessage.hasOwnProperty('n0:SupplierBundleMaintainConfirmation_sync_V1')) {
                let supplierObj = respMessage["n0:SupplierBundleMaintainConfirmation_sync_V1"] != null
                  && respMessage["n0:SupplierBundleMaintainConfirmation_sync_V1"].length == 1 ? respMessage["n0:SupplierBundleMaintainConfirmation_sync_V1"][0] : null;

                let supplier = supplierObj["Supplier"] != null
                  && supplierObj["Supplier"].length == 1 ? supplierObj["Supplier"][0] : null;

                let supplierID = supplier["InternalID"] != null && supplier["InternalID"].length == 1 ? supplier["InternalID"][0] : null;
                let supplierUUID = supplier["UUID"] != null && supplier["UUID"].length == 1 ? supplier["UUID"][0] : null;
                //console.log(supplierID +" - " + supplierUUID);
                let response: ResponseHelper = {
                  success: true,
                  message: 'Your work has been saved',
                  code: 0,
                  helper: {
                    SUPPLIER: supplierID,
                    SUPPLIERUUID: supplierUUID,
                  }
                }
                return response;
              } else {
                //console.log(resp);
                let response: ResponseHelper = {
                  success: false,
                  message: "UNIDENTIFIED ERROR <br>. contact your admin, please.",
                  code: 0
                }
                return response;
              }
            } else {
              //console.log(resp);
              let response: ResponseHelper = {
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
}
