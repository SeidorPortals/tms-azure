import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { CarrierServiceService } from 'src/app/services/carriersService/carrier-service.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { TrailerServiceService } from 'src/app/services/trailerService/trailer-service.service';
import { TrailerUpload, CarrierUpload } from 'src/app/models/uploaders.model';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  DocumentType: string = "1";
  constructor(
              private CarrierService: CarrierServiceService, 
              private toastEvoke: ToastEvokeService, 
              private datePipe: DatePipe,
              private TrailerService : TrailerServiceService,
              ) { }

  ngOnInit(): void {
  }

  getFiles(files: FileVM)
  {
    if(files != null)
    { 
      let ObjCollection : any[][] = [];
      
      let encoded: string = atob(files[0].data64.replace("data:text/csv;base64,",'' ));
      
      const list = encoded.split('\n');
      list.forEach( e => {
        ObjCollection.push(e.replace('\r','').split(','));
        }
      );
      //console.log(this.DocumentType);
      switch (this.DocumentType) {
        case '1':
          for (let i = 1; i < ObjCollection.length; i++) 
          {
            /////Date Formating
            let LASTDOTUPDATE_d = ObjCollection[i][11] != null ? new Date(ObjCollection[i][11]): '';
            let INSURANCEEXPDATE_d = ObjCollection[i][25] != null ? new Date(ObjCollection[i][11]): '';        
            let LASTDOTUPDATE_f = LASTDOTUPDATE_d != '' ? this.datePipe.transform(LASTDOTUPDATE_d,"yyyy-MM-dd") : '';
            let INSURANCEEXPDATE_f = INSURANCEEXPDATE_d != '' ? this.datePipe.transform(INSURANCEEXPDATE_d,"yyyy-MM-dd") : '';
            
            let Registro: CarrierUpload = {
              MC: ObjCollection[i][0] != null ? ObjCollection[i][0] : '',
              NAME: ObjCollection[i][1] != null ? ObjCollection[i][1] : '',
              CITY: ObjCollection[i][2] != null ? ObjCollection[i][2] : '',
              STATE: ObjCollection[i][3] != null ? ObjCollection[i][3] : '',
              COUNTRY: ObjCollection[i][4] != null ? ObjCollection[i][4] : '',
              PHONE: ObjCollection[i][5] != null ? ObjCollection[i][5] : '',
              CONTACT: ObjCollection[i][6] != null ? ObjCollection[i][6] : '',
              LPMEMAIL: ObjCollection[i][7] != null ? ObjCollection[i][7] : '',
              TAXID: ObjCollection[i][8] != null ? ObjCollection[i][8] : '',
              QUICKPAYDISCOUNT: ObjCollection[i][9] != null ? Number(ObjCollection[i][9]) : 0,
              DOT: ObjCollection[i][10] != null ? ObjCollection[i][10] : '',
              LASTDOTUPDATE: LASTDOTUPDATE_f,
              FACTORINGCOMPANYID: ObjCollection[i][12] != null ? Number(ObjCollection[i][12]) : 0,
              FACTORINGEMAIL: ObjCollection[i][13] != null ? ObjCollection[i][13] : '',
              EQUIPMENTTYPEID: ObjCollection[i][14] != null ? Number(ObjCollection[i][14]) : 0,
              VANSNUMB: ObjCollection[i][15] != null ? Number(ObjCollection[i][15]) : 0,
              REEFERSNUMB: ObjCollection[i][16] != null ? Number(ObjCollection[i][16]) : 0,
              FLATBEDS: ObjCollection[i][17] != null ? Number(ObjCollection[i][17]) : 0,
              STEPDECKS: ObjCollection[i][18] != null ? Number(ObjCollection[i][18]) : 0,
              STATUSID: ObjCollection[i][19] != null ? Number(ObjCollection[i][19]) : 0,
              NOTES: ObjCollection[i][20] != null ? ObjCollection[i][20] : '',
              STREET: ObjCollection[i][21] != null ? ObjCollection[i][21] : '',
              HOUSENUMBER: ObjCollection[i][22] != null ? ObjCollection[i][22] : '',
              ZIPCODE: ObjCollection[i][23] != null ? ObjCollection[i][23] : '',
              ADRESS: ObjCollection[i][24] != null ? ObjCollection[i][24] : '',
              INSURANCEEXPDATE: INSURANCEEXPDATE_f,
              EQUIPMENTTYPEDES: ObjCollection[i][26] != null ? ObjCollection[i][26] : '',
              FACTORINGCOMPANYDES: ObjCollection[i][27] != null ? ObjCollection[i][27] : '',
            }
            
            if(Registro.MC != '')
            {
              this.getList(this.CarrierService, Registro)
            }
          }
          //this.toastEvoke.success(`Success!!`, "Creation Finished: ").subscribe();
          
          break;
        case '5':
          for (let i = 1; i < ObjCollection.length; i++) 
          {
            /////Date Formating
            let LICENSEEXPDATE_d = ObjCollection[i][6] != null ? new Date(ObjCollection[i][6]): '';
            let ANNUALINSPECTION_d = ObjCollection[i][7] != null ? new Date(ObjCollection[i][7]): '';
            console.log(LICENSEEXPDATE_d);
            console.log(ObjCollection[i][7]);
            let LICENSEEXPDATE_f = LICENSEEXPDATE_d != '' ? this.datePipe.transform(LICENSEEXPDATE_d,"yyyy-MM-dd") : '';
            let ANNUALINSPECTION_f = ANNUALINSPECTION_d != '' ? this.datePipe.transform(ANNUALINSPECTION_d,"yyyy-MM-dd") : '';
            
            let Registro: TrailerUpload = {
              TRAILERNUMBER: ObjCollection[i][0] != null ? ObjCollection[i][0] : '',
              MAKE: ObjCollection[i][1] != null ? ObjCollection[i][1] : '',
              OWNER: ObjCollection[i][2] != null ? ObjCollection[i][2] : '',
              TYEAR: ObjCollection[i][3] != null ? Number(ObjCollection[i][3]) : 0,
              IDNUMBER: ObjCollection[i][4] != null ? ObjCollection[i][4] : '',
              LICENSEPLATE: ObjCollection[i][5] != null ? ObjCollection[i][5] : '',
              LICENSEEXPDATE: LICENSEEXPDATE_f,////DATE
              ANNUALINSPECTION: ANNUALINSPECTION_f,///DATE
              PHYSICALDAMAGE: ObjCollection[i][8] != null && ObjCollection[i][8] != 'false'? true : false,
              ROOFTYPE: ObjCollection[i][9] != null ? Number(ObjCollection[i][9]) : 0,
              WEIGHT: ObjCollection[i][10] != null ? Number(ObjCollection[i][10]) : 0,
              UNITCODE: ObjCollection[i][11] != null ? ObjCollection[i][11] : '',
              VENTILATION: ObjCollection[i][12] != null && ObjCollection[i][12] != 'false'? true : false,
              AIR: ObjCollection[i][13] != null && ObjCollection[i][13] != 'false'? true : false,
              WHEELREPOSITION: ObjCollection[i][14] != null && ObjCollection[i][14] != 'false'? true : false,
              NOTES: ObjCollection[i][15] != null ? ObjCollection[i][15] : '',
              STATUSID: ObjCollection[i][16] != null ? Number(ObjCollection[i][16]) : 0,
              TRAILERTYPE: ObjCollection[i][17] != null ? ObjCollection[i][17] : '',
              ROOFTYPEDES: ObjCollection[i][18] != null ? ObjCollection[i][18] : '',
              TRAILEREDES: ObjCollection[i][19] != null ? ObjCollection[i][19] : '',
              URLS: ObjCollection[i][20] != null ? ObjCollection[i][20] : '',
              
            }
            
            if(Registro.TRAILERNUMBER != '')
            {
              this.getList(this.TrailerService, Registro)
            }
          }
          break;
        default:
        
          break;
      }
      
    }  
  }

  getList(ObjServiceService: any, Registro: any )
  {
    let resultlog = "";
    // console.log(Registro);
    ObjServiceService.CreateObj(Registro)
    .subscribe(result => {
      console.log(result);
      if(!result['success'])
      {
        //this.toastEvoke.danger(`ERROR SUPPLIER BILL ${result.code}`, result.message).subscribe();
        resultlog = resultlog + " " + result.message + "|";
        
      }
      else
      {
        //this.toastEvoke.success(`Success!!`, result.message).subscribe();
        resultlog = resultlog + " " + result.message + "|";
      }
    });
  }
}