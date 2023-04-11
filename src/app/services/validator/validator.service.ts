import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

interface StatusData {
  status: string,
  number: number,
  watch: boolean,
  text: string,
}

interface CategorieData{
  category: string,
  number: string,
}

interface ErrorStatus{
  code: number, 
  message: string, 
}

interface PayBy{
  id: string,
  name: string,
}

interface Years{
  code: number,
}



export const MESSAGES: { [key: string]: any} = {
  error: '',
  noselected: 'Invalid item',
  invalidFormat: 'Invalid Format',
}


@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public waitTime: number = 20000; //1000 milisegundos = 1 segundo
  public emailPattern: string = "^[^@]+@[^@]+\\.[a-zA-Z]{2,}$";

  

  public statusError: ErrorStatus[] = [
    { code: 301, message: "Moved Permanently. <br> Contacte your admin, please."  },
    { code: 400, message: "Bad Request. <br> Review your entries and try again, if the problem persists, contact your admin."},
    { code: 404, message: "Not Found. <br> Operation no found. if the problem persists, contact your admin."},
    { code: 401, message: "Unauthorized. <br> Sign in, please."},
    { code: 405, message: "Method Not Allowed. <br> You don't have permissions, if the problem persists, contact your admin."  },
    { code: 413, message: "Payload Too Large. <br> Request too large. Review attachments size." },
    { code: 500, message: "Server Error. <br> Try again, if the problem persists, contact your admin." }
  ];

  public statusData: StatusData[] = 
  [ { status: 'In Preparation', number: 1, watch: false, text: ''  }, 
    { status: 'Active', number: 2, watch: true, text: 'Set to Active' }, 
    { status: 'Obsolete', number: 3, watch: true, text: 'Set to Obsolete'  }  
  ];


  public typeAttachments: StatusData[] = 
  [ { status: 'Truck Owner', number: 1, watch: true, text: ''  }, 
    { status: 'Trailer', number: 2, watch: true, text: '' }, 
    { status: 'Truck', number: 3, watch: true, text: ''  },  
    { status: 'Driver', number: 4, watch: true, text: ''  },  
    { status: 'Carrier', number: 5, watch: true, text: ''  }, 
    { status: 'Delivery', number: 6, watch: true, text: ''  },
    { status: 'Trip', number: 7, watch: true, text: ''  },  
    { status: 'Shipments', number: 8, watch: true, text: ''  },  
    { status: 'Customer', number: 9, watch: true, text: ''  }  
  ];

  public statusTrip: StatusData[] = 
  [ { status: 'In Preparation', number: 1, watch: true, text: ''  }, 
    { status: 'Released', number: 2, watch: true, text: '' }, 
    { status: 'Canceled', number: 3, watch: true, text: ''  }  
  ];

  public statusPayment: StatusData[] = [
    { status: 'Billed', number: 1, watch: true, text: ''  }, 
    { status: 'Paid to Carrier', number: 2, watch: true, text: '' }, 
    { status: 'Collected', number: 3, watch: true, text: ''  }  
  ]
  
  public categoriesCost: CategorieData[] = [
    { category: 'Not Selected', number: "",  },
    { category: 'Accesorial Expenses', number: "20000003",  },
    { category: 'Advance', number: "20000004",  },
    { category: 'Broker fee', number: "20000002",  },
    { category: 'Carrier Discount', number: "20000003 " ,   },
    { category: 'Comdata', number: "20000004",   },
    { category: 'Freight Charges', number: "20000032",  },
    { category: 'Lumper Fee', number: "2000033", },
    { category: 'Quick Pay', number: "20000007", }
  ]

  public categoriesCharges: CategorieData[] = [
    { category: 'Not Selected', number: "",  },
    { category: 'Accesorial Income', number: "20000003",  },
    { category: 'Freight Charges', number: "20000032",  },
    { category: 'Lumper Fee', number: "2000033", },
  ]

  public PayByData: PayBy[] = [
    { id: 'Miles', name: "Miles" },
    { id: 'Percent', name: "Percent" },
    { id: 'Revenue', name: "Revenue per mile" }
  ]

  public YearsData: Years[] = [
    { code: 2000 },{ code: 2001 },{ code: 2002 },{ code: 2003 },{ code: 2004 },{ code: 2005 },{ code: 2006 },{ code: 2007 },{ code: 2008 },{ code: 2009 },
    { code: 2010 },{ code: 2011 },{ code: 2012 },{ code: 2013 },{ code: 2014 },{ code: 2015 },{ code: 2016 },{ code: 2017 },{ code: 2018 },{ code: 2019 },
    { code: 2020 },{ code: 2021 },{ code: 2022 },{ code: 2023 }
  ]


  public messages: string[] = [];

  constructor(private ss: NgxSpinnerService) { }

  getrequired(campo: string):string{
    return `Please set a ${campo}`;
  }

  get nomanager(): string {
    return 'The company and agent don\'t have a valid manager';
  }

  getMessageError(code: number){
    let message = "";
    let errorFound = this.statusError.find(x => x.code == code);
    if(errorFound != null){
      message = errorFound.message;
    }
    return message;
  }

  getStatusByCodePayment(code: number){
    let status: string = '';
    switch(code){
      case 1: status = this.statusPayment[0].status;  break;
      case 2: status = this.statusPayment[1].status; break;
      case 3: status = this.statusPayment[2].status; break;
    }
    return status;
  }

  getTypeAttachmentByCode(code: number){
    let status: string = '';
    let encontrado = this.typeAttachments.find(x => x.number == code).status;
    if(encontrado != null){
      status = encontrado;
    }
    return status;
  }

  getCodeCategorieCostByCategorie(code: string){
    let categorieSelected = this.categoriesCost.find(x => x.category == code).number;
    return categorieSelected;
  }


  getCategorieCostByCode(code: string){
    let categorieSelected = this.categoriesCost.find(x => x.number == code).category;
    return categorieSelected;
  }

  getCodeCategorieChargesByCategorie(code: string){
    let categorieSelected = this.categoriesCharges.find(x => x.category == code).number;
    return categorieSelected;
  }

  getCategorieChargesByCode(code: string){
    let categorieSelected = this.categoriesCost.find(x => x.number == code).category;
    return categorieSelected;
  }

  getStatusByCodeTrip(code: number){
    let status: string = '';
    switch(code){
      case 1: status = this.statusTrip[0].status;  break;
      case 2: status = this.statusTrip[1].status; break;
      case 3: status = this.statusTrip[2].status; break;
    }
    return status;
  }

  getStatusByCode(code: number){
    let status: string = '';
    switch(code){
      case 1: status = this.statusData[0].status;  break;
      case 2: status = this.statusData[1].status; break;
      case 3: status = this.statusData[2].status; break;
    }
    return status;
  }

  prueba(){
    console.log(MESSAGES['noSelected']);
  }

  noSelectedValid(control: AbstractControl): ValidationErrors | null {
    const value = control?.value;
    if(value == null || value.length == 0 || value === ''){
      return {
        noselected: true,
      }
    }
    return null;
  }

  noExistManagerCompany(company: string, campo: string){
    return (control: AbstractControl): ValidationErrors | null => {
      if((control.get(campo).value == null || control.get(campo).value.length == 0) && control.get(company).value != null && control.get(company).value.length >= 0 ){
        control.get(campo).setErrors({
          nomanager: true,
        });
        return {
          nomanager: true,
        }
      }
      control.get(campo)?.setErrors(null);
      return null;
    }
  }

  numeric(control: AbstractControl) {
    let val = control.value;

    if (val === null || val === ''){
      return null;
    }
    
    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { invalidNumber: true };

    return null;
  }

  
  //Función asincrona que valida si existe un registro con el mismo valor
  async existBy(campo: string, value: string, service: any){
    let params = {};
    params[campo] = value;
    return await service.existByPromise(params);
  }

  inicializar(name:string){
    this.ss.show(name);
  }

  finalizar(name: string){
    this.ss.hide(name);
  }
}
