import { Component,ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl,Validators, FormGroup } from '@angular/forms';
import { CustomerServiceService } from 'src/app/services/customerService/customer-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { FactoringCompanyService } from 'src/app/services/factoringCompanyService/factoring-company.service';
import { IColumnModal, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
import { IListBasic } from 'src/app/models/list.viewmodel';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


/////SAP BYD models
import { Customer,AddressCustomer,AttachmentsCustomer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  //attachments
  customerFiles: FileVM[] = [];
  attachments: FileVM[] = [];


  ////saved flags
  saved: boolean = false;

  addCustomerForm: FormGroup = new FormGroup({});
  selectedProject ="";
  selectedProperty;
  product;
  public RegionList:{name:string, code:string}[] = RegionCode;
  public CountryList:{name:string, code:string}[] = CountryCode;
  
  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  //Suggestions
  listSuggestionsM: any = [];
  valueField: string = '';


  //Modal OVS
  filterSearch: string = '';
  columnsSelected: IColumnModal[] = [];
  listMSelected: any = [];
  watchOVS: boolean = false;

  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;

  fieldOVSSelected: IItemSelectedModal = {
    id: '',
    name: '',
    field: '',
    title: '',
    index: 0,
  };

  //EL MISMO INDEX TANTO EN LA LISTA COMO EN EL HTML
  fieldsOVS: IItemSelectedModal[] = [
    { id: '', name: '', field: 'FACTORINGCOMPANYID', title: 'FACTORING COMPANY', index: 0 }
  ];

  constructor(
    public vs: ValidatorService, private factoryCompanyService: FactoringCompanyService,  private toastEvoke: ToastEvokeService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, public ObjServiceService: CustomerServiceService, private router: Router) { }
  
  addForm: FormGroup = this.formBuilder.group({
    "MC": new FormControl('', [Validators.required]),
    "NAME": new FormControl(''),
    "ADRESS": new FormControl(''),
    "HOUSENUMBER": new FormControl(''),
    "STREET": new FormControl(''),
    "CITY": new FormControl(''),
    "STATE": new FormControl(''),
    "ZIPCODE": new FormControl(''),
    "PHONE": new FormControl(''),
    "MOBILEPHONE": new FormControl(''),
    "COUNTRY": new FormControl(''),
    "CONTACT": new FormControl(''),
    "SALESMAN": new FormControl(''),
    "FACTORINGCOMPANYID": new FormControl('',[Validators.required]),
    "TERM": new FormControl(''),
    "STATUSID": new FormControl('1'),
    "ACCOUTINGEMAIL": new FormControl(''),
    "NOTIFICATIONEMAIL": new FormControl(''),
    "NOTES": new FormControl(''),
    // "CREATEDBY": new FormControl('Eduardo'),
    // "CREATEDON": new FormControl('2022-10-02 02:33:15.000000000'),
    // "CHANGEBY": new FormControl('Eduardo'),
    // "CHANGEON": new FormControl('2022-10-02 02:33:15.000000000'),
  }
  )

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        this.saved = true;
        localStorage.removeItem('custData');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
  
        let ovsEncontrados: IListBasic[] =  
        [ { ID: 'FACTORINGCOMPANYID', NAME: 'FACTORINGCOMPANYDES' }];
  
        ovsEncontrados.forEach(ovs => {
          let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID'])
          if(ovsSelected != null){
            ovsSelected.id = tst[0][ovs['ID']] != null ?  tst[0][ovs['ID']] : "" ;
            ovsSelected.name = tst[0][ovs['NAME']] != null && tst[0][ovs['NAME']].length > 0 ? tst[0][ovs['NAME']] : "";
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR CUSTOMER 0`, 'CUSTOMER NO FOUND').subscribe();
        this.router.navigate(['./customers']);
      }
    
    }else{
      if(this.addForm.get('STATUSID').value != null && this.addForm.get('STATUSID').value.length > 0){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }
    this.validateStatus();

    this.addForm.valueChanges.subscribe(() => {
      this.validateStatus();
    });
  }

  addFiles(array_files: string[]){
    this.customerFiles = [];
    let listFiles: FileVM[] = [];
    if(array_files.length > 0){
      array_files.forEach(array_file => {
        //0 - url sin nombre //1 - nombre y extension // 2 - vacio
        let name = array_file.split(/([^\/=]*\.[a-z]*)$/); 
        listFiles.push({
          name: name[1],
          url: array_file,
          attachment: null,
          data64: ''
        });
      });
      this.customerFiles = listFiles;
      }
     }
     
  validateStatus(){
    if(
      this.addForm.invalid ||
      this.addForm.get('MC')?.value == "" || this.addForm.get('MC')?.value == null ||
      this.addForm.get('FACTORINGCOMPANYID')?.value == "" || this.addForm.get('FACTORINGCOMPANYID')?.value == null ||
      this.addForm.get('HOUSENUMBER')?.value == "" || this.addForm.get('HOUSENUMBER')?.value == null || 
      this.addForm.get('STREET')?.value == "" || this.addForm.get('STREET')?.value == null ||
      this.addForm.get('CITY')?.value == "" || this.addForm.get('CITY')?.value == null ||
      this.addForm.get('STATE')?.value == "" || this.addForm.get('STATE')?.value == null ||
      this.addForm.get('ZIPCODE')?.value == "" || this.addForm.get('ZIPCODE')?.value == null ||
      this.addForm.get('COUNTRY')?.value == "" || this.addForm.get('COUNTRY')?.value == null 
      ){
        this.statusValid = true;
      }else{
        this.statusValid = false;
      }
  }


  /////////
  

  Countries = [
    {
      key: 'US', value: "United States",
    },
    {
      key: 'CO', value: "Colombia",
    },
    {
      key: 'MX', value: "México",
    }
  ]


  changeProject(e) {
    if (e.target.value == 'US') {
      console.log("United States");
    }
    else if (e.target.value == 'CO') {
      console.log("Colombia");
    }
    else if (e.target.value == 'MX') {
      console.log("México");
    }
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }

  createObj(closescreen: boolean) {
    //console.log(this.addForm);
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          this.saved = true;
          this.CreateCustomer();
          if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
            this.router.navigate(['/customers']);
          }else{
            this.watchChangeEstatus = true;
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      this.isSpinning = false;
    }
    )
    //console.log(this.addEquipmentForm.value);
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.custData );
    console.log(data);
    return data.filter(
      function (data) { return data.MC == code }
    );
  }

  

  actionsave(addForm, closescreen: boolean) {
    this.isSpinning = true;
    //console.log(this.addForm.value);
    const id = this.route.snapshot.paramMap.get('id');
    console.log(closescreen)
    if (id !== '.!' || this.watchChangeEstatus == true) {
      try {
        this.ObjServiceService.EditObj(addForm.value).subscribe(data => {
          if(data['success']){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
                this.router.navigate(['/customers']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
            })
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
          this.isSpinning = false;
        })
      } catch (error) {
        this.isSpinning = false;
        Swal.fire({
          icon: 'error',
          title: 'Review your entries',
          text: error,
          timer: 1500,
          allowOutsideClick: false
        });
      }
    }
    else {
      this.createObj(closescreen);
    }
  }

  loadSuggestions() {
    if (this.listMSelected.length > 0 && this.valueField != null && this.valueField.length > 0) {
      this.listSuggestionsM = this.listMSelected.filter(item => {
        let itemValues: string[] = Object.values(item);
        //let jsonItem = JSON.stringify(itemValues);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a > 0;
      });
    }
  }

  closeModalDropdown(event: boolean) {
    this.watchOVS = event;
  }

  listSelected(index: number, actualizar: boolean = false, suggestions: boolean = false) {
    this.columnsSelected = [];

    if (!actualizar || suggestions) {
      this.fieldOVSSelected = this.fieldsOVS[index];
      this.valueField = this.fieldsOVS[index].name;
    }
    switch (this.fieldsOVS[index].title) {
        case 'FACTORING COMPANY':
          this.columnsSelected.push({ name: 'FACTORING COMPANY', key: 'factoringcompanyid', style: '', isID: true, isNAME: false });
          this.columnsSelected.push({ name: 'NAME', key: 'name', style: '', isID: false, isNAME: true });
  
          this.getList(this.factoryCompanyService, actualizar, suggestions);
          break;
    }
  }

  onChange(event: any, index: number): void {
    this.listSuggestionsM = [];
    this.listMSelected = [];
    if (this.fieldsOVS[index].name != null && this.fieldsOVS[index].name.length > 0) {
      this.listSelected(index, true, true);
    } else {
      this.addForm.get(this.fieldsOVS[index].field).setValue('');
      this.fieldsOVS[index].id = '';

    }
  }

  sinEscribir(event: any, index: number) {
    if (this.listSuggestionsM.length > 0 && (this.fieldsOVS[index].id == null || this.fieldsOVS[index].id == '')) {
      let itemSelected = this.listSuggestionsM.find(x => {
        let itemValues: string[] = Object.values(x);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a
      });
      let newID = '';
      let newName = '';
      if (itemSelected != null) {
        this.columnsSelected.forEach(column => {
          if (column.isID) {
            newID = itemSelected[column.key];
          } else if (column.isNAME) {
            newName = itemSelected[column.key];
          }
        });

        if (newID != null && newID != this.fieldsOVS[index].id) {
          this.fieldsOVS[index].id = newID;
          this.fieldsOVS[index].name = newName;
          this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
        }

        
      } else 
          this.addForm.get(this.fieldsOVS[index].field).setValue('');
          this.fieldsOVS[index].id = '';
        

      
    }
  }


  changeField(event: IItemSelectedModal) {
    let fielOVS = this.fieldsOVS.find(x => x.field === event.field);
    if (fielOVS != null) {
      fielOVS.id = event.id.trim();
      fielOVS.name = event.name.trim();
      this.addForm.get(event.field).setValue(fielOVS.id);
    }
  }


  suggestionSelected(event: any, index: number) {
    if (event != null && event.source != null && event.source.selected) {
      let element: ElementRef = event.source.element;
      let columns: DOMStringMap = element.nativeElement.dataset;
      let text: string = columns.name.trim();
      let value: string = columns.id.trim();
      this.fieldsOVS[index].name = text;
      this.fieldsOVS[index].id = value;
      this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
    }
  }

  getList(service: any, actualizar: boolean = false, suggestions: boolean = false) {
    let list: any = [];
    service.getAll().subscribe(data => {
      if (data != null && Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          let model = {};
          this.columnsSelected.forEach(column => {
            model[column.key] = item[`${column.key.toUpperCase()}`];
          });
          list.push(model);
        });
      }
      this.listMSelected = list;
      if (!actualizar) {
        this.watchOVS = true;
      }

      if (suggestions) {
        this.loadSuggestions();
      }
    });
  }




  getOption(item: any, type: string) {
    let id: string = '';
    let name: string = '';
    let result: string = '';
    this.columnsSelected.forEach(column => {
      if (column.isID) {
        id = item[column.key];
      } else if (column.isNAME) {
        name = item[column.key];
      }
    });

    switch (type) {
      case 'ID': result = id; break;
      case 'NAME': result = name; break;
      case 'OPTION': result = `${id} - ${name}`; break;
    }

    return result;
  }

    //Status
  changeStatus(code: number)
  {
      this.addForm.get('STATUSID').setValue(code);
      this.actionsave(this.addForm, false);
  }
  
  getFiles(files: FileVM []){
    console.log(files);  
    this.attachments =  files;
    console.log(this.attachments);
  }
 
  CreateCustomer()
  {
    let newCustomer: Customer = {
      InternalID: this.addForm.get('MC')?.value != null ? this.addForm.get('MC')?.value : '',
      FirstLineName: this.addForm.get('NAME')?.value != null ? this.addForm.get('NAME')?.value : '',
      CategoryCode: '2',
      Address: [],
      Attachment:[],
    }
    
    let addressCust: AddressCustomer=
    {
      DefaultIndicator: 'true',
      CountryCode: this.addForm.get('COUNTRY')?.value != null ? this.addForm.get('COUNTRY')?.value : '',
      StreetName: this.addForm.get('STREET')?.value != null ? this.addForm.get('STREET')?.value : '',
      HouseID: this.addForm.get('HOUSENUMBER')?.value != null ? this.addForm.get('HOUSENUMBER')?.value : '',
      CityName: this.addForm.get('CITY')?.value != null ? this.addForm.get('CITY')?.value : '',
      RegionCode: this.addForm.get('STATE')?.value != null ? this.addForm.get('STATE')?.value : '',
      StreetPostalCode: this.addForm.get('ZIPCODE')?.value != null ? this.addForm.get('ZIPCODE')?.value : '',
    }
    newCustomer.Address.push(addressCust);
    
    this.attachments.forEach( e => {
      let separator = e.data64.indexOf('base64,') + 7;
      let base64 = e.data64.substring(separator);
      let attachemtCust: AttachmentsCustomer=
      {
        Name: e.attachment.name, 
        B64File: base64, 
      }
      newCustomer.Attachment.push(attachemtCust);
      
    });
    

    
    console.log(newCustomer);
    this.ObjServiceService.CreateObjCustomer(newCustomer)
        .subscribe(result => {
          if(!result['success']){
            //this.existFacturaProveedor = false;
            this.toastEvoke.danger(`ERROR SUPPLIER BILL ${result.code}`, result.message).subscribe();

            // this.canEdit = true;
            this.numberStatus = 1;
            this.addForm.get('STATUSID').setValue(this.numberStatus);
            //this.loadShipments();
          }else{
            this.toastEvoke.success(`Success!!`, result.message).subscribe();
            //   //lo agregamos al trip
            //  this.addForm.get('SUPPLIERINVOICE').setValue(result.helper['SUPPLIERINVOICE']);
            //  this.addForm.get('SUPPLIERINVOICEUUID').setValue(result.helper['SUPPLIERINVOICEUUID']);
  
            //  //actualizamos trip
            //   this.actionsave(this.addForm, false);
          }
        });
      
  }

  sendFile(files: FileVM[], file: FileVM, index: number){
    let responseAttachment: FileVM = {
      attachment: file.attachment,
      data64: ''
    };
    let modelo = {
      fileRaw: file.attachment,
      fileName: file.attachment.name,
      ID: this.addForm.get('MC')?.value != null ? this.addForm.get('MC')?.value : '',
    };
    this.ObjServiceService.CreateAttachments(modelo).subscribe(result => {
      index++;
      if(result['success']){
        this.toastEvoke.success(`CREATED`, `${modelo.fileName} CREATED`).subscribe();

        responseAttachment.name = result.helper != null ? result.helper['name'] : '';
        responseAttachment.url = result.helper != null ? result.helper['url'] : '';

      }else{
        this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
        responseAttachment.name = '';
        responseAttachment.url = '';
      }

     

    });
  }

  // deleteRow(event: any){
  //   if(event != null && event.detail != null && event.detail.item != null){
  //     let child = event.detail.item;
  //     if(child.file != null){
  //       this.renderer.removeChild(this.uploadCollection.nativeElement, child);
  //     }else{
  //       let columns: NamedNodeMap = event.detail.item.attributes;
  //       let nameFile = columns.getNamedItem('file-name').value;
  //       this.service.deleteAttachment(nameFile,this.objectID, this.type).subscribe(result => {
  //         if(result['success']){
  //           this.toastEvoke.success(`DELETED`, `${nameFile} DELETED`).subscribe();
  //           this.renderer.removeChild(this.uploadCollection.nativeElement, child);
  //         }else{
  //           this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
  //         }
  //       });
  //     }
  //   }
  // }
  
}
