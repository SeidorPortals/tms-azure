import { Injectable } from '@angular/core';
import { Observable, of, TimeoutError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpParamsOptions, HttpRequest } from '@angular/common/http';
import { tripModel } from 'src/app/models/trip.model';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { ValidatorService } from '../validator/validator.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  serbase: string = environment.URL_BASE;
  baseUrl: string = this.serbase + '/api/trip';

  //facturas 
  baseFacturaUrlValidate: string = this.serbase + "/api/shipment/CCINV";
  baseFacturaUrl: string = this.serbase + '/api/shipment/CINV';
  basePdfFacturaUrl: string = this.serbase + '/api/rateconfirmation/upload';
  baseUrlDelete: string = this.serbase + "/api/attachment/document"; //delete attachment

  baseUrlRevCarrier: string = this.serbase + "/api/logisticscenarios"; //comparación de carrier y company

  constructor(private http: HttpClient, private vs: ValidatorService) { }

  CreateObjFactura(modelo: any): Observable<any> {
    const headerDict = {
      'Content-Type': 'application/json',
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(modelo);
    //console.log(data);
    return this.http.put(this.baseFacturaUrl, data, requestOptions)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            } else {
              response.message = error['error'].message;
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
          if (resp != null && (!resp.hasOwnProperty('success') || typeof resp.message !== 'string')) {

            if (resp.message != null) {
              let respMessage: any = null;
              if (resp.message != null && Array.isArray(resp.message) && resp.message.length == 1) {
                respMessage = resp.message[0];
              } else if (resp.message) {
                respMessage = resp.message;
              }

              let items: any = null;
              if (respMessage.hasOwnProperty('Log') && respMessage['Log'][0] != null && respMessage['Log'][0]['Item'] != null) {
                items = respMessage['Log'][0]['Item'];
              } else if (respMessage.hasOwnProperty('Item')) {
                items = respMessage['Item'];
              }

              if (items != null) {
                if (Array.isArray(items) && items.some(x => x['SeverityCode'] != null && x['SeverityCode'][0] == '3')) {

                  let messageNotes: string = "";
                  items.forEach(note => {
                    if (note['SeverityCode'] != null && note['SeverityCode'][0] === '3')
                      messageNotes += note['Note'] != null ? `${note['Note']} <br>` : "";
                  });

                  let response: ResponseHelper = {
                    success: false,
                    message: messageNotes,
                    code: resp.code > 0 ? resp.code : 0,
                  }
                  return response;

                } else {
                  let response: ResponseHelper = {
                    success: true,
                    message: 'Your work has been saved',
                    code: 0,
                    helper: null,
                  };

                  let customerData = respMessage['CustomerInvoiceRequest'][0];

                  let invoice = customerData["BaseBusinessTransactionDocumentID"] != null
                    && customerData["BaseBusinessTransactionDocumentID"].length == 1 ? customerData["BaseBusinessTransactionDocumentID"][0] : null;

                  let invoiceUUID = customerData["UUID"] != null && customerData["UUID"].length == 1 ? customerData["UUID"][0] : null;

                  if (invoice != null && invoiceUUID != null) {
                    response.helper = {
                      CUSTOMERINVOICE: invoice,
                      CUSTOMERINVOICEEUUID: invoiceUUID,
                    };
                  } else {
                    response.success = false;
                    response.message = "There was an error getting the Document ID and UUUID, contact your admin. please.";
                  }

                  return response;
                }
              } else {
                let response: ResponseHelper = {
                  success: true,
                  message: 'Your work has been saved',
                  code: 0,
                  helper: null,
                };

                let invoice = respMessage["BaseBusinessTransactionDocumentID"] != null
                  && respMessage["BaseBusinessTransactionDocumentID"].length == 1 ? respMessage["BaseBusinessTransactionDocumentID"][0] : null;

                let invoiceUUID = respMessage["UUID"] != null && respMessage["UUID"].length == 1 ? respMessage["UUID"][0] : null;

                if (invoice != null && invoiceUUID != null) {
                  response.helper = {
                    CUSTOMERINVOICE: invoice,
                    CUSTOMERINVOICEEUUID: invoiceUUID,
                  };
                } else {
                  response.success = false;
                  response.message = "There was an error getting the Document ID and UUUID, contact your admin. please.";
                }

                return response;
              }
            }
          }
          return resp;
        })
      );
  }

  CreateObjFacturaProveedor(modelo: any): Observable<any> {
    const headerDict = {
      'Content-Type': 'application/json',
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(modelo);
    //console.log(data);
    return this.http.put(this.baseUrl + "/SINV", data, requestOptions)
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
          if (error.name === 'HttpErrorResponse') {
            let message = this.vs.getMessageError(error['status']);
            if (message != null) {
              response.message = message;
              response.code = error['status'];
            }
            if (error['error'] != null && typeof error['error'].message === 'string' && error['error'].message != null) {
              response.message = response.message + `<br> ${error['error'].message}`;
            } else {
              response.message = error['error'].message;
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
          if (resp != null && (!resp.hasOwnProperty('success') || typeof resp.message !== 'string')) {

            if (resp.message != null) {
              let respMessage: any = null;
              if (resp.message != null && Array.isArray(resp.message) && resp.message.length == 1) {
                respMessage = resp.message[0];
              } else if (resp.message) {
                respMessage = resp.message;
              }

              let items: any = null;
              if (respMessage.hasOwnProperty('Log') && respMessage['Log'][0] != null && respMessage['Log'][0]['Item'] != null) {
                items = respMessage['Log'][0]['Item'];
              } else if (respMessage.hasOwnProperty('Item')) {
                items = respMessage['Item'];
              }

              if (items != null) {
                if (Array.isArray(items) && items.some(x => x['SeverityCode'] != null && x['SeverityCode'][0] == '3')) {

                  let messageNotes: string = "";
                  items.forEach(note => {
                    if (note['SeverityCode'] != null && note['SeverityCode'][0] === '3')
                      messageNotes += note['Note'] != null ? `${note['Note']} <br>` : "";
                  });

                  let response: ResponseHelper = {
                    success: false,
                    message: messageNotes,
                    code: resp.code > 0 ? resp.code : 0,
                  }
                  return response;

                } else {
                  let response: ResponseHelper = {
                    success: true,
                    message: 'Your work has been saved',
                    code: 0,
                    helper: null,
                  };

                  let customerData = respMessage['CustomerInvoiceRequest'][0];

                  let invoice = customerData["BusinessTransactionDocumentID"] != null
                    && customerData["BusinessTransactionDocumentID"].length == 1 ? customerData["BusinessTransactionDocumentID"][0] : null;

                  let invoiceUUID = customerData["UUID"] != null && customerData["UUID"].length == 1 ? customerData["UUID"][0] : null;

                  if (invoice != null && invoiceUUID != null) {
                    response.helper = {
                      SUPPLIERINVOICE: invoice,
                      SUPPLIERINVOICEUUID: invoiceUUID,
                    };
                  } else {
                    response.success = false;
                    response.message = "There was an error getting the Document ID and UUUID, contact your admin. please.";
                  }

                  return response;
                }
              } else {
                let response: ResponseHelper = {
                  success: true,
                  message: 'Your work has been saved',
                  code: 0,
                  helper: null,
                };

                let invoice = respMessage["BusinessTransactionDocumentID"] != null
                  && respMessage["BusinessTransactionDocumentID"].length == 1 ? respMessage["BusinessTransactionDocumentID"][0] : null;

                let invoiceUUID = respMessage["UUID"] != null && respMessage["UUID"].length == 1 ? respMessage["UUID"][0] : null;

                if (invoice != null && invoiceUUID != null) {
                  response.helper = {
                    SUPPLIERINVOICE: invoice,
                    SUPPLIERINVOICEUUID: invoiceUUID,
                  };
                } else {
                  response.success = false;
                  response.message = "There was an error getting the Document ID and UUUID, contact your admin. please.";
                }

                return response;

              }
            } else {
              // console.log(resp);
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

  ValidateBillSupplier(equipmentObj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj);
    console.log(data);
    return this.http.put(this.baseUrl + "/CSINV", data, requestOptions)
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
          if (resp != null && (!resp.hasOwnProperty('success') || typeof resp.message !== 'string')) {

            if (resp.message != null) {
              let respMessage: any = null;
              if (resp.message != null && Array.isArray(resp.message) && resp.message.length == 1) {
                respMessage = resp.message[0];
              } else if (resp.message) {
                respMessage = resp.message;
              }

              let items: any = null;
              if (respMessage.hasOwnProperty('Log') && respMessage['Log'][0] != null && respMessage['Log'][0]['Item'] != null) {
                items = respMessage['Log'][0]['Item'];
              } else if (respMessage.hasOwnProperty('Item')) {
                items = respMessage['Item'];
              }

              if (items != null) {
                if (Array.isArray(items) && items.some(x => x['SeverityCode'] != null && x['SeverityCode'][0] == '3')) {

                  let messageNotes: string = "";
                  items.forEach(note => {
                    if (note['SeverityCode'] != null && note['SeverityCode'][0] === '3')
                      messageNotes += note['Note'] != null ? `${note['Note']} <br>` : "";
                  });

                  let response: ResponseHelper = {
                    success: false,
                    message: messageNotes,
                    code: resp.code > 0 ? resp.code : 0,
                  }
                  return response;

                } else {
                  let response: ResponseHelper = {
                    success: true,
                    message: 'Your work has been saved',
                    code: 0,
                  }
                  return response;
                }
              } else {

                let response: ResponseHelper = {
                  success: true,
                  message: 'Your work has been saved',
                  code: 0,
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

  ValidateBillCustomer(equipmentObj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(equipmentObj);
    console.log(data);
    return this.http.put(this.baseFacturaUrlValidate, data, requestOptions)
      .pipe(
        //manejo de errores
        //timeout(this.vs.waitTime), //tiempo de espera
        catchError((error: HttpErrorResponse | TimeoutError) => {
          // console.log(error);
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
            } else {
              response.message = error['error'].message;
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
          // console.log(resp);

          if (resp != null && (!resp.hasOwnProperty('success') || typeof resp.message !== 'string')) {

            if (resp.message != null) {
              let respMessage: any = null;
              if (resp.message != null && Array.isArray(resp.message) && resp.message.length == 1) {
                respMessage = resp.message[0];
              } else if (resp.message) {
                respMessage = resp.message;
              }


              let items: any = null;
              if (respMessage.hasOwnProperty('Log') && respMessage['Log'][0] != null && respMessage['Log'][0]['Item'] != null) {
                items = respMessage['Log'][0]['Item'];
              } else if (respMessage.hasOwnProperty('Item')) {
                items = respMessage['Item'];
              }

              if (items != null) {
                if (Array.isArray(items) && items.some(x => x['SeverityCode'] != null && x['SeverityCode'][0] == '3')) {

                  let messageNotes: string = "";
                  items.forEach(note => {
                    if (note['SeverityCode'] != null && note['SeverityCode'][0] === '3')
                      messageNotes += note['Note'] != null ? `${note['Note']} <br>` : "";
                  });

                  let response: ResponseHelper = {
                    success: false,
                    message: messageNotes,
                    code: resp.code > 0 ? resp.code : 0,
                  }
                  return response;

                } else {
                  let response: ResponseHelper = {
                    success: true,
                    message: 'Your work has been saved',
                    code: 0,
                  }
                  return response;
                }
              } else {

                let response: ResponseHelper = {
                  success: true,
                  message: 'Your work has been saved',
                  code: 0,
                }
                return response;
              }

            }
          }
          return resp;
        })
      );
  }


  CreateObj(equipmentObj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
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
          // console.log(error);
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

  async ValidateCarrier(object: any): Promise<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    let requrl = this.baseUrlRevCarrier + `?CARRIERID=${object['CARRIERID']}&COMPANYID=${object['COMPANYID']}`;
    return await new Promise((resolve, reject) => {

      this.http.get(requrl, requestOptions)
        .pipe(
          //manejo de errores
          timeout(this.vs.waitTime), //tiempo de espera
          catchError((error: HttpErrorResponse | TimeoutError) => {
            // console.log(error);
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
              if (resp['case'] != null && resp['message'] != null && typeof resp.message === 'string') {
                let response: ResponseHelper = {
                  success: true,
                  message: resp['case'] != null ? resp['case'] : "",
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
        ).subscribe(result => {
          resolve(result);
        });

    });
  }



  EditObj(Obj: any): Observable<ResponseHelper> {
    const headerDict = {
      'Content-Type': 'application/json',
      'x-token': '' + localStorage.getItem('token') + ''
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const data = JSON.stringify(Obj, this.replacer, "\t");
    //console.log(data);
    return this.http.patch(this.baseUrl, data, requestOptions)
      .pipe(
        //manejo de errores
        timeout(this.vs.waitTime), //tiempo de espera
        catchError((error: HttpErrorResponse | TimeoutError) => {
          // console.log(error);
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

  deleteBy(params: any): Observable<any> {
    const data = JSON.stringify(params);

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
          //console.log(error);
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

  CreateRateConfirmation(form: any): Observable<ResponseHelper> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'multipart/form-data',
    //     'x-token': ''+ localStorage.getItem('token')+''
    //   })
    // }

    const body = new FormData();
    body.append('archivo', form.fileRaw, form.fileName);
    body.append('objectid', form.ID);
    return this.http.put(this.basePdfFacturaUrl, body)
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

  getBy(params: any): Observable<tripModel[] | ResponseHelper> {
    let modelo: HttpParamsOptions = {
      fromObject: params,
    }
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-token': '' + localStorage.getItem('token') + ''
      }),
      params: new HttpParams(modelo),
    }

    return this.http.get<tripModel[] | ResponseHelper>(this.baseUrl, options)
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
        map((resp: tripModel[] | ResponseHelper) => {
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
    console.log(this.baseUrl);
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
          // console.log(error);
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

  getByOwl(params: any): Observable<tripModel[] | ResponseHelper> {
    let modelo: HttpParamsOptions = {
      fromObject: params,
    }
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'x-token': '' + localStorage.getItem('token') + ''
      }),
      params: new HttpParams(modelo),
    }

    return this.http.get<tripModel[] | ResponseHelper>(this.baseUrl+"/TRIPOWL", options)
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
        map((resp: tripModel[] | ResponseHelper) => {
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

  replacer(key, value) {
    // Filtering out properties
    if (value === null) {
      return "";
    }
    return value;
  }
}
