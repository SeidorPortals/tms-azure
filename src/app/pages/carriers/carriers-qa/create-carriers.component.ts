import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CarrierServiceService } from 'src/app/services/carriersService/carrier-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import "@ui5/webcomponents/dist/Badge";

import { carrierModel } from 'src/app/models/carriers.model';
import { HttpClient } from '@angular/common/http';
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/DatePicker";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import "@ui5/webcomponents-icons/dist/value-help.js";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents-icons/dist/cancel.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Panel";
import "@ui5/webcomponents-icons/dist/save.js";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import "@ui5/webcomponents-icons/dist/slim-arrow-left";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents/dist/MenuItem.js";
import "@ui5/webcomponents-icons/dist/upload.js";
import { map } from 'rxjs/operators';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { IColumnModal, IItemSelect, IItemSelectedModal, INamesList } from 'src/app/models/modal-dropdown.viewmodel';
import { EquipmentTypeServiceService } from 'src/app/services/equipmentTypeService/equipment-type-service.service';

import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/DatePicker";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents-icons/dist/cancel.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents/dist/RadioButton";
import "@ui5/webcomponents-icons/dist/save.js";
import "@ui5/webcomponents-icons/dist/undo.js";
import "@ui5/webcomponents-icons/dist/upload-to-cloud";
import "@ui5/webcomponents-icons/dist/paper-plane";


//uuidv4
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { FactoringCompanyService } from 'src/app/services/factoringCompanyService/factoring-company.service';
import { UserServiceService } from 'src/app/services/userService/user-service.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { IListBasic } from 'src/app/models/list.viewmodel';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

///createsuppliers
import { AddressProveedor, Proveedor ,AttachmentsProveedor} from 'src/app/models/factura.viewmodel';
import { Console } from 'console';
import { Attachment } from '../../../models/upload-attachment.viewmodel';


@Component({
  selector: 'app-create-carriers',
  templateUrl: './create-carriers.component.html',
  styleUrls: ['./create-carriers.component.css']
})
export class CreateCarriersComponent implements OnInit {
  public RegionList: { name: string, code: string }[] = RegionCode;
  public CountryList: { name: string, code: string }[] = CountryCode;

  AttPKoculto : boolean = true;
  AttMCDOToculto : boolean = true;
  AttCOIoculto : boolean = true;
  AttW9oculto : boolean = true;

  //
  canEdit: boolean = true;
  saved: boolean = false;

  //attachments
  carrierFiles: FileVM[] = [];

  Packagefile: File ;
  MCDOTfile: File ;
  COIfile: File;
  W9file: File;

  //Suggestions
  listSuggestionsM: any = [];
  valueField: string = '';

  //spinning
  isSpinning: boolean = false;

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
    { id: '', name: '', field: 'EQUIPMENTTYPEID', title: 'EQUIPMENT TYPE', index: 0 },
    { id: '', name: '', field: 'FACTORINGCOMPANYID', title: 'FACTORING COMPANY', index: 1 }
  ];



  constructor(

    public vs: ValidatorService, private toastEvoke: ToastEvokeService,
    private factoringCompanyService: FactoringCompanyService, private equipmentTypesService: EquipmentTypeServiceService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, public ObjServiceService: CarrierServiceService,
    private router: Router, private http: HttpClient) { }

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;
  statusValid: boolean = false;


  addForm: FormGroup = this.formBuilder.group({

    "MC": ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[0-9]*$")]],
    "NAME": ['', [Validators.required, Validators.minLength(1)]],
    "CITY": ['', [Validators.required, Validators.minLength(1)]],
    "STATE": ['', [Validators.required, Validators.maxLength(2)]],
    "COUNTRY": ['', [Validators.required]],
    "PHONE": ['', [Validators.pattern("^[0-9]*$")]],
    "CONTACT": [''],
    "LPMEMAIL": ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    "TAXID": ['', [Validators.pattern("^[0-9]{4}-[0-9]{2}-[0-9]{4}?$")]],
    "QUICKPAYDISCOUNT": [0],
    "DOT": ['',[Validators.pattern("^[0-9]*$")]],
    "LASTDOTUPDATE": [''],
    "FACTORINGCOMPANYID": ['', [Validators.required, Validators.minLength(1)]],
    "FACTORINGEMAIL": ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    "EQUIPMENTTYPEID": ['', [Validators.required, Validators.minLength(1)]],
    "VANSNUMB": [0],
    "REEFERSNUMB": [0],
    "FLATBEDS": [0],
    "STEPDECKS": [0],
    "STATUSID": ['1'],
    "NOTES": [''],
    "STREET": ['', [Validators.required, Validators.minLength(1)]],
    "HOUSENUMBER": ['', [Validators.required, Validators.minLength(1)]],
    "ZIPCODE": ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), Validators.pattern("^[0-9]*$")]],
    "ADRESS": [''],
    "INSURANCEEXPDATE": ['', [Validators.required]],
    "EQUIPMENTTYPEDES": ['A'],
    "FACTORINGCOMPANYDES": ['A'],
    // "CREATEDBY": ['Eduardo'],
    // "CREATEDON": ['2022-10-02 02:33:15.000000000'],
    // "CHANGEBY": ['Eduardo'],
    // "CHANGEON": ['2022-12-02 01:22:17.000000000'],

  }
  )


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    //console.log(this.RegionList)
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if (tst != null) {
        this.saved = true;
        localStorage.removeItem('carriers');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];

        if (tst[0]['URLS'] != null && tst[0]['URLS'] !== '') {
          let valor: string = tst[0]['URLS'];
          let array_files = valor.split(' ');
          console.log(array_files);
          this.addFiles(array_files);
        }

        let ovsEncontrados: IListBasic[] =
          [{ ID: 'EQUIPMENTTYPEID', NAME: 'EQUIPMENTTYPEDES' }, { ID: 'FACTORINGCOMPANYID', NAME: 'FACTORINGCOMPANYDES' }];

        ovsEncontrados.forEach(ovs => {
          let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID'])
          if (ovsSelected != null) {
            ovsSelected.id = tst[0][ovs['ID']] != null ? tst[0][ovs['ID']] : "";
            ovsSelected.name = tst[0][ovs['NAME']] != null && tst[0][ovs['NAME']].length > 0 ? tst[0][ovs['NAME']] : "";
          }
        });
      } else {
        this.toastEvoke.danger(`ERROR CARRIER 0`, 'CARRIER NO FOUND').subscribe();
        this.router.navigate(['./carriers']);
      }
    } else {
      if (this.addForm.get('STATUSID').value != null) {
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }
    //console.log(this.addForm.controls['EQUIPMENTTYPEID'].value)

    this.validateStatus();

    this.addForm.valueChanges.subscribe((f) => {
      this.validateStatus();
    });
  }




  addFiles(array_files: string[]) {
    this.carrierFiles = [];
    let listFiles: FileVM[] = [];
    if (array_files.length > 0) {
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
      this.carrierFiles = listFiles;
    }
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
      InternalID: this.addForm.get('MC')?.value != null ? this.addForm.get('MC')?.value : '',
      FirstLineName: this.addForm.get('NAME')?.value != null ? this.addForm.get('NAME')?.value : '',
      SupplierIndicator: 'true',
      Address: [],
      Attachment: [],
    }
    suplier.Address.push(addressProv);
    let attachments = JSON.parse(localStorage.getItem('services_assigned'));
    attachments.forEach( e => {
      let separator = e.data64.indexOf('base64,') + 7;
      let base64 = e.data64.substring(separator);
      let attachemtCust: AttachmentsProveedor=
      {
        Name: e.attachment.name,
        UUID: e.Attachment, 
        B64File: base64, 
      }
      suplier.Attachment.push(attachemtCust);
      
    });
    console.log(suplier);
    this.ObjServiceService.CreateObjProveedor(suplier)
      .subscribe(result => {
        if (!result['success']) {
          //this.existFacturaProveedor = false;
          this.toastEvoke.danger(`ERROR SUPPLIER BILL ${result.code}`, result.message).subscribe();

          this.canEdit = true;
          this.numberStatus = 1;
          this.addForm.get('STATUSID').setValue(this.numberStatus);
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

  validateStatus() {
    if (
      this.addForm.get('MC')?.value == "" || this.addForm.get('MC')?.value == null ||
      this.addForm.get('NAME')?.value == "" || this.addForm.get('NAME')?.value == null ||
      this.addForm.get('FACTORINGCOMPANYID')?.value == "" || this.addForm.get('FACTORINGCOMPANYID')?.value == null ||
      this.addForm.get('EQUIPMENTTYPEID')?.value == "" || this.addForm.get('EQUIPMENTTYPEID')?.value == null ||
      this.addForm.get('INSURANCEEXPDATE')?.value == "" || this.addForm.get('INSURANCEEXPDATE')?.value == null ||
      this.addForm.get('HOUSENUMBER')?.value == "" || this.addForm.get('HOUSENUMBER')?.value == null ||
      this.addForm.get('STREET')?.value == "" || this.addForm.get('STREET')?.value == null ||
      this.addForm.get('CITY')?.value == "" || this.addForm.get('CITY')?.value == null ||
      this.addForm.get('STATE')?.value == "" || this.addForm.get('STATE')?.value == null ||
      this.addForm.get('ZIPCODE')?.value == "" || this.addForm.get('ZIPCODE')?.value == null ||
      this.addForm.get('COUNTRY')?.value == "" || this.addForm.get('COUNTRY')?.value == null
    ) {
      this.statusValid = true;
    } else {
      this.statusValid = false;
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

      case 'EQUIPMENT TYPE':
        this.columnsSelected.push({ name: 'EQUIPMENT TYPE ID', key: 'equipmenttypeid', style: '', isID: true, isNAME: false });
        this.columnsSelected.push({ name: 'DESCRIPTION', key: 'description', style: '', isID: false, isNAME: true });

        this.getList(this.equipmentTypesService, actualizar, suggestions);
        break;
      case 'FACTORING COMPANY':
        this.columnsSelected.push({ name: 'FACTORING COMPANY', key: 'factoringcompanyid', style: '', isID: true, isNAME: false });
        this.columnsSelected.push({ name: 'NAME', key: 'name', style: '', isID: false, isNAME: true });

        this.getList(this.factoringCompanyService, actualizar, suggestions);
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



  getResources() {
    return this.http.get("../assets/data/resources.json").pipe(
      map(this.crearArreglo)
    );

  }

  private crearArreglo(clientObj: object) {
    const clients: carrierModel[] = [];
    if (clientObj === null) {
      return [];
    }
    else {


      Object.keys(clientObj).forEach(key => {
        if (clientObj[key] != null) {
          const client: carrierModel = clientObj[key];
          client.mc = key;
          clients.push(client);
        }
      })
      //console.log("Clientes");
      //console.log(clients);
      return clients;
    }

  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }
  
  validarfecha(campo: string) 
  {
    if(this.addForm.controls[campo].touched)
    {
      if(campo &&  isNaN(this.addForm.get(campo).value )  )
      {
        let ayer = new Date(new Date().setDate(new Date().getDate()-1));
        let ingresada = new Date(this.addForm.get(campo).value);
        var EndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        console.log(EndDate);
        console.log(ingresada)
        return ingresada.getTime() > ayer.getTime() && ingresada.getTime() <= EndDate.getTime() ;      
      }
    }
    
    
  }

  createObj(addForm: FormGroup, closescreen: boolean) {
    // this.sendSupplier();
    let mc = this.addForm.get('MC').value;
    this.addForm.get('MC').setValue(mc.trim());
    this.ObjServiceService.CreateObj(addForm.value).subscribe(result => {
      if (result.success) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          this.saved = true;
          if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
            this.router.navigate(['./carriers']);
          } else {
            this.watchChangeEstatus = true;

          }
        })
      } else {
        this.isSpinning = false;
        this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
      }
      this.isSpinning = false;
    });
  }

  getByCode(code) {
    let data = JSON.parse(localStorage.carriers);
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.MC == code }
    );
  }

  actionsave(addForm: FormGroup, closescreen: boolean) {
    ////validate  null on numbers and trim values
    this.ValidatedefaultData();

    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '.!' || this.watchChangeEstatus == true) {
      try {
        this.ObjServiceService.EditObj(addForm.value).subscribe(result => {
          if (result['success']) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
                this.router.navigate(['/carriers']);
              } else {
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
            });
          } else {
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
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
      this.createObj(addForm, closescreen);
    }
  }
  //////


  /////

  //Status
  changeStatus(code: number) {
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
    if (code == 2) {
      //this.sendSupplier();
    }
  }

  getFiles(files: FileVM) {
    console.log(files);
  }

  ///setting 0 null numbers and trim values
  ValidatedefaultData()
  {

    if(this.addForm.get("QUICKPAYDISCOUNT").value == null)
    {
      this.addForm.get("QUICKPAYDISCOUNT").setValue(0);
    }

    if(this.addForm.get("VANSNUMB").value == null)
    {
      this.addForm.get("VANSNUMB").setValue(0);
    }

    if(this.addForm.get("REEFERSNUMB").value == null)
    {
      this.addForm.get("REEFERSNUMB").setValue(0);
    }

    if(this.addForm.get("FLATBEDS").value == null)
    {
      this.addForm.get("FLATBEDS").setValue(0);
    }

    if(this.addForm.get("STEPDECKS").value == null)
    {
      this.addForm.get("STEPDECKS").setValue(0);
    }
    
    this.addForm.get("MC").setValue(this.addForm.get("MC").value.trim());
    this.addForm.get("NAME").setValue(this.addForm.get("NAME").value.trim());
    this.addForm.get("CITY").setValue(this.addForm.get("CITY").value.trim());
    this.addForm.get("STATE").setValue(this.addForm.get("STATE").value.trim());
    this.addForm.get("PHONE").setValue(this.addForm.get("PHONE").value.trim());
    this.addForm.get("CONTACT").setValue(this.addForm.get("CONTACT").value.trim());
    this.addForm.get("LPMEMAIL").setValue(this.addForm.get("LPMEMAIL").value.trim());
    this.addForm.get("TAXID").setValue(this.addForm.get("TAXID").value.trim());
    this.addForm.get("DOT").setValue(this.addForm.get("DOT").value.trim());
    this.addForm.get("FACTORINGEMAIL").setValue(this.addForm.get("FACTORINGEMAIL").value.trim());
    this.addForm.get("NOTES").setValue(this.addForm.get("NOTES").value.trim());
    this.addForm.get("STREET").setValue(this.addForm.get("STREET").value.trim());
    this.addForm.get("ADRESS").setValue(this.addForm.get("ADRESS").value.trim());
    this.addForm.get("EQUIPMENTTYPEDES").setValue(this.addForm.get("EQUIPMENTTYPEDES").value.trim());
    this.addForm.get("FACTORINGCOMPANYDES").setValue(this.addForm.get("FACTORINGCOMPANYDES").value.trim());
  }

  onChangeFile(event: any, drop: boolean = false)
  {
    event.preventDefault();
    let file: File[] = [];
    file = event.detail.files;
    console.log(file);
    if(file != null && file.length > 0)
    {
      // //validamos el peso
      // if(file[0].size > 3000000){
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'warning',
      //     title: 'The attachment cannot exceed 3Mb',
      //     showConfirmButton: true,
      //     timer: 2000,
      //   });
      //   return;
      // }
      switch (event.srcElement.id) 
      {
        case "attPackage":
            this.Packagefile = file[0];
            this.AttPKoculto = false;
          break;
        case "attMCDOT":
            this.MCDOTfile = file[0];
            this.AttMCDOToculto = false;
          break;
        case "attCOI":
            this.COIfile = file[0];
            this.AttCOIoculto = false;
          break;
        case "attW9":
            this.W9file = file[0];
            this.AttW9oculto = false;
          break;
      }
      
    }
  }
}
