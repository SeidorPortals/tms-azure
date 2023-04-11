import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , RequiredValidator, Validators} from '@angular/forms';
import { TruckownerService } from 'src/app/services/truckowner/truckowner.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

import "@ui5/webcomponents/dist/Title";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/DatePicker";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents-icons/dist/value-help.js";
import "@ui5/webcomponents-icons/dist/cancel.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/save.js";

import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";

import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';

import { ValidatorService } from 'src/app/services/validator/validator.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { IColumnModal, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
import { InsuranceCompanyService } from 'src/app/services/insuranceCompany/insurance-company.service';
import { IListBasic } from 'src/app/models/list.viewmodel';
import { PaybasisService } from 'src/app/services/paybasis/paybasis.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


import { AddressProveedor, Proveedor ,AttachmentsProveedor} from 'src/app/models/factura.viewmodel';

@Component({
  selector: 'app-create-truckowner',
  templateUrl: './create-truckowner.component.html',
  styleUrls: ['./create-truckowner.component.css']
})
export class CreateTruckownerComponent implements OnInit {
  Escrow = "";
  public RegionList:{name:string, code:string}[] = RegionCode;
  public CountryList:{name:string, code:string}[] = CountryCode;
  

  //FILES
  truckFiles: FileVM[] = [];
  ////saved flags
  saved: boolean = false;

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;

//OVS
  //Suggestions
  listSuggestionsM: any = [];
  valueField: string = '';


  //Modal OVS
  filterSearch: string = '';
  columnsSelected: IColumnModal[] = [];
  listMSelected: any = [];
  watchOVS: boolean = false;

  fieldOVSSelected: IItemSelectedModal = {
    id: '',
    name: '',
    field: '',
    title: '',
    index: 0,
  };

  //EL MISMO INDEX TANTO EN LA LISTA COMO EN EL HTML
  fieldsOVS: IItemSelectedModal[] = [
    { id: '', name: '', field: 'INSURANCECOMPANY', title: 'INSURANCE COMPANY', index: 0 },
    { id: '', name: '', field: 'PAYBASIS', title: 'PAY BASIS', index: 1 },
  ];

  constructor(
    public vs: ValidatorService,  private toastEvoke: ToastEvokeService,
    private insuranceCompanyService: InsuranceCompanyService, private payBasisService: PaybasisService,
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    public ObjServiceService: TruckownerService, 
    private router: Router,) { }

    addForm: FormGroup = this.formBuilder.group({
    "TRUCKOWNERID": ['', [Validators.required, Validators.minLength(1)]],
		"NAME": ['', [Validators.required]], 
		"TAXID": [''], 
		"ADRESS": [''], 
		"CITY": [''], 
		"STATE": [''], 
		"ZIPCODE": [''], 
		"COUNTRY": [''], 
		"PHONE": [''], 
		"INVESTOREMAIL": ['',[Validators.pattern(this.vs.emailPattern)]], 
		"EMAIL": ['',[Validators.pattern(this.vs.emailPattern)]], 
		"SECURITYSOCIAL": ['',[Validators.minLength(9)]], 
		"SUITE": [''], 
		"INSURANCECOMPANY": [''], 
		"PHYSICALDAMAGE": [false],
		"INSURANCEPOLICYEXP": ['', [Validators.required]], 
		"EXCROWMAXAMOUNT": [0, [this.vs.numeric]], 
		"EXCROWMAXCURRENCY": ['USD'], 
		"SECONDARYESCROW": [0, [this.vs.numeric]],
		"SECONDARYESCROWCURRENCY": ['USD'], 
		"TRAILEROWNER": [false],
		"YARD": [false],
		"WITHSCROW": [false],
		"SCROWTYPE": ['1'] ,
		"PAYTYPE": [''],
		"PAYBASIS": ['',[Validators.required]], 
		"IFTA": [''], 
		"IFTAEXPIRANTIONDATE": [''], 
		"KYU": [''], 
		"KYUEXPIRANTIONDATE": [''], 
		"NM": [''], 
		"NMEXPIRANTIONDATE": [''], 
		"NY": [''], 
		"NYEXPIRANTIONDATE": [''], 
		"MC": [''], 
		"DOT": [''], 
		"STATUSID": ['1'], 
		"NOTES": [''],
    "STREET": [''], 
    "HOUSENUMBER": [''], 
    })

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        this.saved = true;
        localStorage.removeItem('truckowner');
        this.addForm.patchValue(tst[0]);
        if(tst[0]['HOUSENUMBER'] === null || tst[0]['HOUSENUMBER'] === 'null'){
          this.addForm.get('HOUSENUMBER').setValue('');
        }
  
        if(tst[0]['STREET'] === null || tst[0]['STREET'] === 'null'){
          this.addForm.get('STREET').setValue('');
        }
  
        if(tst[0]['PAYTYPE'] === null || tst[0]['PAYTYPE'] === 'null'){
          this.addForm.get('PAYTYPE').setValue('');
        }
  
        if(tst[0]['URLS'] != null && tst[0]['URLS'] !== ''){
          let valor: string = tst[0]['URLS'];
          //console.log(valor);
          let array_files = valor.split(' ');
          this.addFiles(array_files);
        }
  
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
  
        let ovsEncontrados: IListBasic[] =  
        [ { ID: 'INSURANCECOMPANY', NAME: 'INSURANCECOMPANYDES' }];
  
        ovsEncontrados.forEach(ovs => {
          let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID'])
          if(ovsSelected != null){
            ovsSelected.id = tst[0][ovs['ID']] != null ?  tst[0][ovs['ID']] : "" ;
            ovsSelected.name = tst[0][ovs['NAME']] != null && tst[0][ovs['NAME']].length > 0 ? tst[0][ovs['NAME']] : "";
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR TRUCKOWNER 0`, 'TRUCKOWNER NO FOUND').subscribe();
        this.router.navigate(['./truckowners']);
      }

    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }

    this.validateStatus();

    this.addForm.valueChanges.subscribe(() => {
      this.validateStatus();
    });
    
    this.addForm.get("KYU").valueChanges.subscribe((value) => {
      this.validDate("KYUEXPIRANTIONDATE", value);
    });
    this.addForm.get("NM").valueChanges.subscribe((value) => {
      this.validDate("NMEXPIRANTIONDATE", value);
    });
    this.addForm.get("NY").valueChanges.subscribe((value) => {
      this.validDate("NYEXPIRANTIONDATE", value);
    });
  }

  validDate(data: string, value: string){
    let fieldValid = this.addForm.get(data);
      fieldValid.clearValidators();

      if(value != null && value != ""){
        fieldValid.addValidators([Validators.required])
      }
      
      //Para evitar problemas con la validacion marcamos el campo con 
      // dirty, de esta manera se ejecutan de nuevo las validaciones
      fieldValid.markAsDirty()
      //Actualizamos las validaciones
      fieldValid.updateValueAndValidity()
      //Mostramos mensajes de validación
      fieldValid.markAsTouched();
  }

  validateStatus(){
    if(
      this.addForm.invalid ||
      this.addForm.get('PAYBASIS')?.value == "" || this.addForm.get('PAYBASIS')?.value == null ||
      this.addForm.get('SECURITYSOCIAL')?.value == "" || this.addForm.get('SECURITYSOCIAL')?.value == null || 
      this.addForm.get('INSURANCECOMPANY')?.value == "" || this.addForm.get('INSURANCECOMPANY')?.value == null ||
      this.addForm.get('INSURANCEPOLICYEXP')?.value == "" || this.addForm.get('INSURANCEPOLICYEXP')?.value == null ||
      this.addForm.get('HOUSENUMBER')?.value == "" || this.addForm.get('HOUSENUMBER')?.value == null ||
      this.addForm.get('STREET')?.value == "" || this.addForm.get('STREET')?.value == null ||
      this.addForm.get('CITY')?.value == "" || this.addForm.get('CITY')?.value == null ||
      this.addForm.get('STATE')?.value == "" || this.addForm.get('STATE')?.value == null ||
      this.addForm.get('ZIPCODE')?.value == "" || this.addForm.get('ZIPCODE')?.value == null ||
      this.addForm.get('COUNTRY')?.value == "" || this.addForm.get('COUNTRY')?.value == null ||
      this.addForm.get('IFTA')?.value == "" || this.addForm.get('IFTA')?.value == null ||
      this.addForm.get('IFTAEXPIRANTIONDATE')?.value == "" || this.addForm.get('IFTAEXPIRANTIONDATE')?.value == null 
      ){
        this.statusValid = true;
      }else{
        this.statusValid = false;
      }
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }

  createObj(closescreen: boolean) {
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(result => {
      if(result['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          this.saved = true;
          if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
            this.router.navigate(['/truckowners']);
          }else{
            this.watchChangeEstatus = true;
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
      }
      this.isSpinning = false;
    });
  }


  addFiles(array_files: string[]){
    this.truckFiles = [];
    let listFiles: FileVM[] = [];
    if(array_files.length > 0){
      array_files.forEach(array_file => {
        //0 - url sin nombre //1 - nombre y extension // 2 - vacio
        //let name = array_file.split(/([^\/=]*\.[a-z]*)$/); 
        //console.log(array_file);
        if(array_file.trim().length > 0)
        {
          
          let UUIDs = array_file.split('[')[0].split('.com/')[1];     
          let name =  array_file.split('[')[1].split(']')[0];
          let sync =  array_file.split('[')[2].split(']')[0];
          
          listFiles.push({
            UUID: UUIDs,
            name: name.trim(),
            url: array_file.split('[')[0],
            attachment: null,
            data64: '',
            sync: JSON.parse(sync)
          });
        }
        
      });
      //console.log(listFiles);
      this.truckFiles = listFiles;
    }
  }


  getByCode(code) {
    let data = JSON.parse(localStorage.truckowner);
    //console.log(data);
    return data.filter(
      function (data) { return data.TRUCKOWNERID == code }
    );
  }

  formatFields(){
    for (let campo in this.addForm.controls) { 
      let control = this.addForm.get(campo);
      if(control.value != null && control.value != "" && typeof control.value == "string"){
        this.addForm.get(campo).setValue(control.value.trim());
      }
      if((control.value == null || control.value == "") && control.hasValidator(this.vs.numeric)){
        this.addForm.get(campo).setValue(0);
      }
    }
  }

  actionsave(addForm, closescreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.formatFields();

    if (id !== '.!' || this.watchChangeEstatus == true) {
      try {
        this.ObjServiceService.EditObj(addForm.value).subscribe(result => {
          if(result['success']){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
                this.router.navigate(['/truckowners']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
            });
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
          this.isSpinning = false;
        })
      } catch (error) {
        this.isSpinning = true;
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

    //Status
    changeStatus(code: number){
      this.addForm.get('STATUSID').setValue(code);
      this.actionsave(this.addForm, false);
      console.log(code);
      if(code == 2)
      {
        
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
        case 'INSURANCE COMPANY':
          this.columnsSelected.push({ name: 'INSURANCE COMPANY', key: 'insurancecompany', style: '', isID: true, isNAME: false });
          this.columnsSelected.push({ name: 'DESCRIPTION', key: 'description', style: '', isID: false, isNAME: true });
          this.getList(this.insuranceCompanyService, actualizar, suggestions);
          break;
        case 'PAY BASIS':
            this.columnsSelected.push({ name: 'ID', key: 'paybasis', style: '', isID: true, isNAME: false });
            this.columnsSelected.push({ name: 'DESCRIPTION', key: 'description', style: '', isID: false, isNAME: true });
            this.getList(this.payBasisService, actualizar, suggestions);
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
            } 
            if (column.isNAME) {
              newName = itemSelected[column.key];
            }
          });
          console.log(newID +"-" + newName)
          if (newID != null && newID != this.fieldsOVS[index].id) {
            // if(this.fieldsOVS[index].field === 'PAYBASIS'){
            //   this.fieldsOVS[index].id = "";
            //   this.fieldsOVS[index].name = newName;
            //   this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
            // }else{
              this.fieldsOVS[index].id = newID;
              this.fieldsOVS[index].name = newName;
              this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
            //}
          }
        } else 
            this.addForm.get(this.fieldsOVS[index].field).setValue('');
            this.fieldsOVS[index].id = '';
          
  
        
      }
    }
  
  
    changeField(event: IItemSelectedModal) {
      let fielOVS = this.fieldsOVS.find(x => x.field === event.field);
      if (fielOVS != null) {
        // if(fielOVS.field === 'PAYBASIS'){
        //   fielOVS.id = '';
        //   fielOVS.name = event.name.trim();
        //   this.addForm.get(event.field).setValue(fielOVS.name);
        // }else{
          fielOVS.id = event.id.trim();
          fielOVS.name = event.name.trim();
          this.addForm.get(event.field).setValue(fielOVS.id);
        //}
      
      }
    }
  
  
    suggestionSelected(event: any, index: number) {
      if (event != null && event.source != null && event.source.selected) {
        let element: ElementRef = event.source.element;
        let columns: DOMStringMap = element.nativeElement.dataset;
        let text: string = columns.name.trim();
        let value: string = columns.id.trim();
        // if(this.fieldsOVS[index].field === 'PAYBASIS'){
        //   this.fieldsOVS[index].name = text;
        //   this.fieldsOVS[index].id = '';
        //   this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
        // }else{
          this.fieldsOVS[index].name = text;
          this.fieldsOVS[index].id = value;
          this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
        //}
      
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
        } 
        if (column.isNAME) {
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

    sendSupplier() {
      let addressProv: AddressProveedor =
      {
        CountryCode: this.addForm.get('COUNTRY')?.value != null ? this.addForm.get('COUNTRY')?.value : '',
        StreetName: this.addForm.get('STREET')?.value != null ? this.addForm.get('STREET')?.value : '',
        HouseID: this.addForm.get('HOUSENUMBER')?.value != null ? this.addForm.get('HOUSENUMBER')?.value : '',
        CityName: this.addForm.get('CITY')?.value != null ? this.addForm.get('CITY')?.value : '',
        RegionCode: this.addForm.get('STATE')?.value != null ? this.addForm.get('STATE')?.value : '',
        StreetPostalCode: this.addForm.get('ZIPCODE')?.value != null ? this.addForm.get('ZIPCODE')?.value : '',
      }
      let suplier: Proveedor = {
        InternalID: this.addForm.get('TRUCKOWNERID')?.value != null ? this.addForm.get('TRUCKOWNERID')?.value : '',
        FirstLineName: this.addForm.get('NAME')?.value != null ? this.addForm.get('NAME')?.value : '',
        SupplierIndicator: 'true',
        Address: [],
        Attachment: [],
      }
      suplier.Address.push(addressProv);
      let attachments = JSON.parse(localStorage.getItem('CarrAtta'));
      attachments.forEach( e => {
       if(e.sync == false)
       {
        let attachemtCust: AttachmentsProveedor=
        {
          Name: e.name,
          UUID: e.UUID, 
          B64File: btoa(e.url), 
        }
        suplier.Attachment.push(attachemtCust);
       }
        
        
      });
      //console.log(suplier);
      this.ObjServiceService.CreateObjBYD(suplier)
        .subscribe(result => {
          if (!result['success']) {
            //this.existFacturaProveedor = false;
            this.toastEvoke.danger(`ERROR SUPPLIER ${result.code}`, result.message).subscribe();
  
            //this.canEdit = true;
            //this.numberStatus = 1;
            //this.addForm.get('STATUSID').setValue(this.numberStatus);
            //this.loadShipments();
          } else {
            this.toastEvoke.success(`Success!!`, result.message).subscribe();
            //   //lo agregamos al trip
            //  this.addForm.get('SUPPLIERINVOICE').setValue(result.helper['SUPPLIERINVOICE']);
            //  this.addForm.get('SUPPLIERINVOICEUUID').setValue(result.helper['SUPPLIERINVOICEUUID']);
  
            //  //actualizamos trip
            //   this.actionsave(this.addForm, false);
          }
        });
  
    }
}
