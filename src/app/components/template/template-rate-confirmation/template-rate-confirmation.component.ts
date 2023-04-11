import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ITruckBrokers } from 'src/app/models/upload-attachment.viewmodel';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var htmlToPdfmake = require("html-to-pdfmake");

@Component({
  selector: 'app-template-rate-confirmation',
  templateUrl: './template-rate-confirmation.component.html',
  styleUrls: ['./template-rate-confirmation.component.css']
})
export class TemplateRateConfirmationComponent implements OnInit, OnChanges {

  @Input() model: ITruckBrokers = {
    phone: '',
    fax: '',
    trip: '',
    pickUpRate: '',
    equipmenttype: '',
    carrier: '',
    deliveryDate: '',
    transportType: '',
    dispatcherphone1: '',
    truck: '',
    driver: '',
    temperature: '',
    trailer: '',
    totalPay: '',
    customer: '',
  };
  @Input() descargar: boolean = false;
  @ViewChild('template') template : ElementRef;

  @Output() cerrar = new EventEmitter<ResponseHelper>(); 

  html: any;
  nombreFile: string = '';

  logoBase64: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadImages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.descargar){
      this.nombreFile = `TRUCK-BROKERS-${this.model.trip}`;
      //console.log(this.model);
      this.download();
    }
  }
  
  loadImages = async () => {
    this.logoBase64 = await this.getBase64ImageFromURL('assets/img/UTBLOGOJPG.jpg');
    //console.log(this.logoBase64);
  }


  prepararPDF = async () => {
    const template = this.template.nativeElement;

    let html = htmlToPdfmake(template.innerHTML, {
      imagesByReference: true,
      tableAutoSize: true,
      defaultStyles: {
        p: {
          margin: [0, 1, 0, 1]
        },
        h6: {
          margin: [0, 1, 0, 1]
        },
        h4: {
          margin: [0, 1, 0, 1]
        }
      }
    });

    const documentDefinition: TDocumentDefinitions = {
      content: [html.content],
      images: html.images,
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 50], //MARGIN => IZQUIERDA, ARRIBA, DERECHA, ABAJO
      footer: (currentPage: any, pageCount: any) =>{
        return [
          {
            columns: [
              {
                width: '100%',
                stack: [
                  {
                    text: `${currentPage.toString()} de ${pageCount}`,
                    alignment: 'right',
                    fontSize: 8,
                    margin: [0, 20, 40, 0]
                  }
                ]
              }
            ]
          }
        ]
      },
      header: {
        columns: [
          {
            width: '100%',
            stack:[
              {
                text: 'TRUCK BROKERS',
                alignment: 'center',
                margin: [0,15,0,0],
                fontSize: 8,
              }
            ]
          }
        ]
      },
    };

    return documentDefinition;
  }


  download = async () => {
    let documentDefinition = await this.prepararPDF();

    const generador = pdfMake.createPdf(documentDefinition);
    	
    let responseHelper: ResponseHelper = {
      success: false,
      message: '',
      code: 0
    };

    generador.getBlob( (data: any) => {
      responseHelper.helper = data;
      this.cerrar.emit(responseHelper);
    });
    
    // generador.getDataUrl( (dataUrl: any) => {
    //   responseHelper.helper = dataUrl;
    //   this.cerrar.emit(responseHelper);
    // });
  }
  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/jpg");
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

}
