import { Component, ElementRef, OnInit  } from '@angular/core';
import { TripService } from 'src/app/services/tripService/trip.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

////UI5 Components
import "@ui5/webcomponents/dist/FileUploader.js";
import "@ui5/webcomponents/dist/Link";
import "@ui5/webcomponents/dist/DateTimePicker.js";
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
import "@ui5/webcomponents-icons/dist/accept";
import "@ui5/webcomponents-icons/dist/show";
import { DriverServiceService } from 'src/app/services/driverService/driver-service.service';
import { TruckServiceService } from 'src/app/services/truckService/truck-service.service';
import { TrailerServiceService } from 'src/app/services/trailerService/trailer-service.service';
import { IColumnModal, IItemSelect, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
import { CarrierServiceService } from 'src/app/services/carriersService/carrier-service.service';
import { EquipmentTypeServiceService } from 'src/app/services/equipmentTypeService/equipment-type-service.service';

//uuidv4
import { v4 as uuidv4 } from 'uuid';
import { FileVM, ICarrierCostVM, ICarrierVM, IDeliveryVM, IPickUpVM, ITruckBrokers } from 'src/app/models/upload-attachment.viewmodel';
import { ShipmentService } from 'src/app/services/shipmentService/shipment.service';
import { IColumnTable, IListBasic, IRowFactura } from 'src/app/models/list.viewmodel';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { CustomerChargeService } from 'src/app/services/customerChargeService/customer-charge.service';
import { PickupsService } from 'src/app/services/pickupsService/pickups.service';
import { DatePipe } from '@angular/common';
import { DeliveriesService } from 'src/app/services/deliveriesService/deliveries.service';
import { CarrierscostService } from 'src/app/services/carrierscostService/carrierscost.service';
import { UserServiceService } from 'src/app/services/userService/user-service.service';
import { UserfindetailsService } from 'src/app/services/userfindetailsService/userfindetails.service';
import { FacturaClient, FacturaItemClient, FacturaItemProveedor, FacturaProveedor, IFactura, IFacturaItem } from 'src/app/models/factura.viewmodel';
import { ResponseHelper } from 'src/app/models/util.viewmodel';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { ISpinner, IText } from 'src/app/components/btn/loading/loading.component';
import { debug } from 'console';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css'],
  providers: [DatePipe],
})
export class CreateTripComponent implements OnInit {

  //attachments
  tripFiles: FileVM[] = [];
  pdfRate: string = "";

  //SPINNER BLOCK
  spPantalla: ISpinner = {
    name: "protector",
    bdColor: "rgba(255,255,255,0.0)",
    size: "medium",
    type: "none",
  }

  txtPantalla: IText = {
    estilo: '',
    texto: ''
  }

  isValidateBill: boolean = false;
  isFinishLoad: boolean = false;
  isLoading: boolean[] = [false,false,false,false,false]; //save and close, save, +, validate, release

  tripUUID: string = '';
  tripID: string = '';

  //cuando se selecciona un shipment de la lista
  shipmenIDSelected: string = '';
  numberStatus: number = 1;
  canEdit: boolean = true;

  //lista de los carriers
  carriersSelect: IItemSelect[] = [];

  //crear el pdf
  iniciarDescarga: boolean = false;

  //lista de shipments
  listShipments: any = [];
  listShipmentsOriginal: any[] = [];

  listFilterShipments: any = [];
  columnsShipment: IColumnTable[] =
    [ { title: "Number" , key: "SHIPMENTID", type: "NUMBER", select: true, style: '' }, 
      { title: "Customer" , key: "CUSTOMER", type: "TEXT", style: ''  },
      { title: "Customer PO", type: "TEXT", key: "CUSTOMERPO", style: ''  },  
      { title: "City From" , key: "CITYFROM", type: "TEXT", style: ''  },
      { title: "City To" , key: "CITYTO", type: "TEXT", style: '' }, 
      { title: "Cost" , key: "COST", type: "NUMBER", style: ''  },
      { title: "Revenue" , key: "REVENUE", type: "NUMBER", style: ''  }, 
      { title: "Pick Up Date", key: "PICKUPDATETIME", type: "DATE", style: ''  },
      { title: "Delivery Date" , key: "DELIVERYDATETIME", type: "DATE", style: ''}, 
      { title: 'Actions', key: '', type: 'TEXT', style: '' },
      { title: "CustomerID", type: "TEXT", key: "CUSTOMERINVOICE", watch: false, style: ''  },  
      { title: "CustomerUUID", type: "TEXT", key: "CUSTOMERINVOICEUUID", watch: false, style: ''  },
    ]

  //mostrar la ventana del shipment
  watchAddShipment: boolean = false;

  loadAttachment: boolean = false;

      addForm: FormGroup = this.formBuilder.group({
        "TRIPID": [''],
        "COMPANY": ['', this.vs.noSelectedValid ],
        "CARRIER": ['', this.vs.noSelectedValid],
        "SECONDCARRIER": ['DUMMY'], 
        "VPOFSALE": [''],
        "VPOFSALENAME": [''],
        "AGENT": ['', Validators.required],
        "AGENTNAME": [''],
        "TOTALMILES": [150],
        "TRIPSTATUSID": [1],
        "PAYSTATUSID": [1],
        "TRANSPORTTYPE": ["0"], 
        "DRIVER": ['', this.vs.noSelectedValid],
        "TRUCK": ['', this.vs.noSelectedValid],
        "TRAILER": ['', this.vs.noSelectedValid],
        "SECONDDRIVER": ['DUMMY'],
        "SECONDTRUCK": ['DUMMY'],
        "SECONDTRAILER": ['DUMMY'],
        "DISPATCHERDRIVERPHONE": [''],
        "SECONDDISPATCHERDRIVERPHONE": [''],
        "EQUIPMENTTYPE": ['', this.vs.noSelectedValid], 
        "TEMPERATURE": ['0'], //integer
        "CARRIERCONFSENTDATE": [new Date()],
        "CARRIERCONFSENTBY": [''],
        "SPECIALINSTRUCTIONS": [''],
        "CARRIERNOTES": [''],
        "GENERALNOTES": [''],
        "CARRIEREMAIL": [''],
        "AGENTEMAIL": [''],
        "CREATEDBY": [''],
        "CREATEDON": [new Date()],
        "CHANGEBY": [''],
        "CHANGEON": [new Date()],
        "SUPPLIERINVOICE": [''],
        "SUPPLIERINVOICEUUID": [''],
        "STATUSID": [1],
        "TUUID": [''],
      }, {
        validators: [this.vs.noExistManagerCompany("COMPANY","VPOFSALE")] //validacion global
      });


//OVS
  //Suggestions
  listSuggestionsM: any = [];
  valueField: string = '';

  //Modal OVS
  filterSearch: string = '';
  columnsSelected: IColumnModal[] = [];
  listMSelected: any = [];
  watchOVS: boolean = false;

  fieldOVSSelected: IItemSelectedModal = { id: '', name: '', field: '',title: '',index: 0,};

    //LAS POSICIONES DEBEN SER IGUALES A LOS DEFINIDOS EN EL HTML DEL COMPONENTE
  fieldsOVS: IItemSelectedModal[] = [
    { id: '', name: '', field: 'DRIVER', title: 'DRIVER', index: 0},
    { id: '', name: '', field: 'TRUCK', title: 'TRUCK', index: 1},
    { id: '', name: '', field: 'TRAILER', title: 'TRAILER', index: 2},
    { id: '', name: '', field: 'CARRIER', title: 'CARRIER', index: 3},
    { id: '', name: '', field: 'EQUIPMENTTYPE', title: 'EQUIPMENT TYPE', index: 4},
    { id: '', name: '', field: 'SECONDCARRIER', title: 'SECOND CARRIER', index: 5},
    { id: '', name: '', field: 'SECONDDRIVER', title: 'SECOND DRIVER', index: 6},
    { id: '', name: '', field: 'SECONDTRUCK', title: 'SECOND TRUCK', index: 7},
    { id: '', name: '', field: 'SECONDTRAILER', title: 'SECOND TRAILER', index: 8},
    { id: '', name: '', field: 'COMPANY', title: 'COMPANY', index: 9}
  ];

//ESTATUS => RELEASED
  sapFacturas: IFactura = {
    items: [],
    companySelected: {},
    sum: 0,
    rest: 0,
    exist: 0,
    proveedors: [],
    specialBill: {
      case: 1,
      index: 10,
    }
  };

  //pdf
  truckBrokers: ITruckBrokers = {
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
  }

  customerChargeCategory: any[] = [];
  carrierCostCatgeory: any[] = [];
  constructor(
    public vs: ValidatorService,
    private toastEvoke: ToastEvokeService,
    private formBuilder: FormBuilder, private datePipe: DatePipe,
    private userService: UserServiceService, private detailsService: UserfindetailsService,
    public tripService: TripService, private shipmentService: ShipmentService, private companyService: CompanyService,
     private carrierService: CarrierServiceService, private equipmentTypesService: EquipmentTypeServiceService,
     private driverService: DriverServiceService, private truckService: TruckServiceService, private trailerService: TrailerServiceService,
     private customerChargesService: CustomerChargeService, private pickupService: PickupsService, private deliveryService: DeliveriesService,
     private carrierCostService: CarrierscostService,
     private route: ActivatedRoute, private router: Router,
     private ObjServiceService: TripService, ) {

     }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.vs.inicializar("buttonSpinner");
    this.getCarrierCostCategory();
    if (id !== '.!') {
      this.getTrip(id);
    }else{
      //generamos el UUID
      this.generarUUID();
      this.addForm.get('AGENT').setValue(this.userService.email);
      this.addForm.get('CREATEDBY').setValue(this.userService.email);
      this.addForm.get('CHANGEBY').setValue(this.userService.email);
    }
  }

  generarUUID(){
    let generadorUUID = uuidv4();
    this.addForm.get('TUUID').setValue(generadorUUID);
    this.tripUUID = generadorUUID;
  }

  getTrip(id: string){
    let modelo = { "TRIPID": id};
    this.tripService.getBy(modelo).subscribe(data => {
      if(Array.isArray(data)){
        if(data.length == 1){
          this.tripID = data[0].TRIPID.toString();

          if(data[0].TUUID != null && data[0].TUUID.length > 0){
            this.tripUUID = data[0].TUUID;
          }else{
            this.generarUUID();
          }

          this.numberStatus = data[0].STATUSID;

          if(this.vs.getStatusByCodeTrip(this.numberStatus) === 'Released'){
            this.canEdit = false;
          }

          this.addForm.reset({
          "TRIPID": data[0].TRIPID,
            "COMPANY": data[0].COMPANY,
            "CARRIER": data[0].CARRIER,
            "SECONDCARRIER": data[0].SECONDCARRIER,
            "VPOFSALE": data[0].VPOFSALE,
            "VPOFSALENAME": data[0].VPOFSALENAME,
            "AGENT": data[0].AGENT,
            "AGENTNAME": data[0].AGENTNAME,
            "TOTALMILES": data[0].TOTALMILES,
            "TRIPSTATUSID": data[0].TRIPSTATUSID,
            "PAYSTATUSID": data[0].PAYSTATUSID,
            "TRANSPORTTYPE": data[0].TRANSPORTTYPE,
            "DRIVER": data[0].DRIVER,
            "TRUCK": data[0].TRUCK,
            "TRAILER": data[0].TRAILER,
            "SECONDDRIVER": data[0].SECONDDRIVER,
            "SECONDTRUCK": data[0].SECONDTRUCK,
            "SECONDTRAILER": data[0].SECONDTRAILER,
            "DISPATCHERDRIVERPHONE": data[0].DISPATCHERDRIVERPHONE,
            "SECONDDISPATCHERDRIVERPHONE": data[0].SECONDDISPATCHERDRIVERPHONE,
            "EQUIPMENTTYPE": data[0].EQUIPMENTTYPE,
            "TEMPERATURE": data[0].TEMPERATURE != null ? data[0].TEMPERATURE : '0',
            "CARRIERCONFSENTDATE": data[0].CARRIERCONFSENTDATE,
            "CARRIERCONFSENTBY": data[0].CARRIERCONFSENTBY,
            "SPECIALINSTRUCTIONS": data[0].SPECIALINSTRUCTIONS,
            "CARRIERNOTES": data[0].CARRIERNOTES,
            "GENERALNOTES": data[0].GENERALNOTES,
            "CARRIEREMAIL": data[0].CARRIEREMAIL,
            "AGENTEMAIL": data[0].AGENTEMAIL,
            "CREATEDBY": data[0].CREATEDBY,
            "CREATEDON": data[0].CREATEDON,
            "CHANGEBY": this.userService.email,
            "CHANGEON": new Date(),
            "SUPPLIERINVOICE": data[0].SUPPLIERINVOICE,
            "SUPPLIERINVOICEUUID": data[0].SUPPLIERINVOICEUUID,
            "STATUSID": data[0].STATUSID,
            "TUUID": this.tripUUID,
          });

          if(data[0]['URLS'] != null && data[0]['URLS'] !== ''){
            let valor: string = data[0]['URLS'];
            let array_files = valor.split(' ');
            this.addFiles(array_files);
          }

          this.loadAttachment = true;

          if(data[0]['URLRATE'] != null && data[0]['URLRATE'] !== ''){
            let valor: string = data[0]['URLRATE'];
            let array_files = valor.split(' ');
            this.pdfRate = array_files[array_files.length - 1];
          }

          if(data[0]['AGENT'] == null || data[0]['AGENT'].length == 0){
            this.addForm.get('AGENT')?.setValue(this.userService.email);
          }

          let selectPredeterminado: string[] = ['CARRIER', 'SECONDCARRIER'];

          let ovsEncontrados: IListBasic[] =  [ { ID: 'CARRIER', NAME: 'NAMECR'  }, {ID: 'EQUIPMENTTYPE', NAME: 'DESCRIPTIONEQT'} ,{ID: 'DRIVER', NAME: 'NAMEDR'},
          {ID: 'TRUCK', NAME: 'MAKETUK'} , {ID: 'TRAILER', NAME: 'MAKETRL'}, {ID: 'SECONDCARRIER', NAME: 'NAMECRII'} , {ID: 'SECONDDRIVER', NAME: 'NAMEDRII'} ,
          {ID: 'SECONDTRUCK', NAME: 'MAKETUKII'},  {ID: 'SECONDTRAILER', NAME: 'MAKETRLII'}, {ID: 'COMPANY', NAME: 'NAMECMP'}];

          ovsEncontrados.forEach( ovs => {
            let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID']);
            if(ovsSelected != null){
              if(data[0][ovs['ID']] !== 'DUMMY'){
                if(data[0][ovs['NAME']] != null && data[0][ovs['NAME']].length > 0){
                  ovsSelected.id = data[0][ovs['ID']];
                  ovsSelected.name = data[0][ovs['NAME']];
                }else{
                  ovsSelected.id = '';
                  ovsSelected.name = data[0][ovs['ID']];
                }


                if(selectPredeterminado.some(x => x === ovs['ID'])){

                  this.carriersSelect.push({
                    value: ovsSelected.id,
                    text: ovsSelected.name,
                    field: ovsSelected.field,
                    selected: false
                  });

                }
              }
            }
          });

          this.getCarrierSelected();
          this.changeManagers(data[0].COMPANY, true);

        }else{
          this.toastEvoke.warning(`ERROR TRIP 0`, "TRIP NO FOUND, contact your admin, please.").subscribe();
          this.router.navigate(['./trips']);
        }
      }else{
        this.toastEvoke.warning(`ERROR TRIP ${data.code}`, data.message).subscribe();
        this.router.navigate(['/trips']);
      }
    });
  }


  getCarrierCostCategory(){
    this.carrierCostCatgeory = [];
    this.carrierCostService.getCategories().subscribe(categories => {
      if(categories != null && Array.isArray(categories) && categories.length > 0){
        this.carrierCostCatgeory = categories.map( (categorie) => {
          let type: string = "002";

          if(categorie['DESCRIPTION'].toLowerCase().includes("broker fee") || categorie['DESCRIPTION'].toLowerCase().includes("advance")
            || categorie['DESCRIPTION'].toLowerCase().includes("quick pay"))
          {
            type = "003";
          }

          return {
            DESCRIPTION: categorie['DESCRIPTION'],
            CATEGORY: categorie['CATEGORY'],
            TYPE: type,
          }

        });
      }
    });
  }

  getCategoryByCodeCarrierCost(code: string){
    let category = null;
    let encontrado = this.carrierCostCatgeory.find(x => x['CATEGORY'] === code);
    if(encontrado != null){
      category = encontrado;
    }
    return category;
  }

  validarFacturas(index: number = 0, customer: boolean = true){
    if(index == this.sapFacturas.items.length  && customer){
      console.log("FINISH VALIDATE CUSTOMER");
      this.validarFacturas(0, false);
    }else{
      if(index < this.sapFacturas.items.length && customer){
        this.validarFacturaCustomer(index);
  
      }else if(index < this.sapFacturas.proveedors.length && !customer){
        this.validarFacturaProveedor(index);
      }else{
        this.isLoading[3] = false;
        this.toastEvoke.success(`Success!!`, 'Ready for the release').subscribe();
        this.isValidateBill = true;
      }
    }
  } 

  validarFacturaProveedor(index: number){
    let facturaSelected = this.sapFacturas.proveedors[index];
    this.tripService.ValidateBillSupplier(facturaSelected.proveedor).subscribe(result => {
      if(!result['success']){
        this.isLoading[3] = false;
        this.toastEvoke.danger(`ERROR BILL SUPPLIER ${result.code}`, result.message).subscribe();
        this.canEdit = true;
      }else{
        index++;
        this.validarFacturas(index, false);
      }
    });
  }

  validarFacturaCustomer(index: number){
    let facturaSelected = this.sapFacturas.items[index];
    this.tripService.ValidateBillCustomer(facturaSelected.client)
    .subscribe(result => {
      if(!result['success']){
        //ERROR
        this.toastEvoke.danger(`ERROR BILL CUSTOMER ${facturaSelected.shipmentID}`, result.message).subscribe();
        this.isLoading[3] = false;
        this.canEdit = true;
      }else{
        index++;
        //console.log(result);
        this.validarFacturas(index);
      }
    });
  }

  sendRelease(){
    this.isLoading[4] = true;
    this.canEdit = false;
    this.numberStatus = 2
    this.addForm.get('STATUSID').setValue(this.numberStatus);

    let generar: boolean = false;
    let search: string = `PDF-TRIP-${this.tripID}`;

    if(localStorage.getItem(search) == null){
      if(this.truckBrokers.carriers != null && this.truckBrokers.carriers.length > 0){
        let sum = 0;
        this.truckBrokers.carriers.forEach(carrier => {
          sum += parseInt(carrier.payment);
        });
        this.truckBrokers.totalPay = sum.toString();
      }else{
        this.truckBrokers.totalPay = '0';
      }

      this.truckBrokers.trip = this.tripID;
      this.truckBrokers.pickUpRate = this.truckBrokers.pickUp != null ? this.truckBrokers.pickUp.pickUpDate : '';
      this.truckBrokers.deliveryDate = this.truckBrokers.delivery != null ? this.truckBrokers.delivery.deliveryDate : '';
      this.truckBrokers.dispatcherphone1 = this.addForm.get('DISPATCHERDRIVERPHONE').value;
      this.truckBrokers.temperature = this.addForm.get('TEMPERATURE').value;
      this.truckBrokers.transportType = this.getTransportType(this.addForm.get('TRANSPORTTYPE').value);

      let ovsSearch: string[] = ["TRUCK", "DRIVER", "TRAILER", "CARRIER", "EQUIPMENTTYPE"]
      ovsSearch.forEach(ovs => {
        let ovsSelected = this.fieldsOVS.find(x => x.field == ovs);
        if(ovsSelected != null){
          this.truckBrokers[ovs.toLowerCase()] = `${ovsSelected.name}`;
        }
      });
      generar = true;
    }

    this.isValidateBill = false;
    
    setTimeout( () => {
      this.sendFacturas();

      if(generar){
        this.iniciarDescarga = true;
      }
    }, 1000);
  }

  sendFacturas(index: number = 0, customer: boolean = true){
    if(index == this.sapFacturas.items.length  && customer){
      console.log("FINISH CUSTOMER");
      this.sendFacturas(0, false);
    }else{
      if(index < this.sapFacturas.items.length && customer){
        this.sendFacturaCustomer(index);
  
      }else if(index < this.sapFacturas.proveedors.length && !customer){
        this.sendFacturaProveedor(index);
      }else{
        this.isLoading[4] = false;
        this.actionsave(this.addForm, false, true);
      }
    }
  }

  sendFacturaProveedor(index: number){
    let facturaSelected = this.sapFacturas.proveedors[index];
    this.tripService.CreateObjFacturaProveedor(facturaSelected.proveedor)
    .subscribe(result => {
      if(!result['success']){
        this.isLoading[4] = false;
        this.toastEvoke.danger(`ERROR SUPPLIER BILL ${result.code}`, result.message).subscribe();

        this.canEdit = true;
        this.loadShipments('',true);
      }else{
        if(facturaSelected.special){

        }else{
          this.numberStatus = 2
          this.addForm.get('STATUSID').setValue(this.numberStatus);
          this.addForm.get('SUPPLIERINVOICE').setValue(result.helper['SUPPLIERINVOICE']);
          this.addForm.get('SUPPLIERINVOICEUUID').setValue(result.helper['SUPPLIERINVOICEUUID']);
        }
        index++;
        this.sendFacturas(index,false);
      }
    });
  }

  sendFacturaCustomer(index: number){
    let facturaSelected = this.sapFacturas.items[index];
    this.tripService.CreateObjFactura(facturaSelected.client)
    .subscribe(result => {
      if(!result['success']){
        //ERROR
        this.isLoading[4] = false;
        this.toastEvoke.danger(`ERROR BILL CUSTOMER ${facturaSelected.shipmentID}`, result.message).subscribe();

        this.canEdit = true;
        this.loadShipments('',true);
      }else{
        //buscamos
        if(facturaSelected.special){
          index++;
          this.sendFacturas(index);
        }else{
          let existe = this.listShipmentsOriginal.find(x => x['SHIPMENTID'] == facturaSelected.shipmentID);
          if(existe != null){
            existe['CUSTOMERINVOICE'] = result.helper['CUSTOMERINVOICE'];
            existe['CUSTOMERINVOICEUUID'] = result.helper['CUSTOMERINVOICEEUUID'];
  
            //actualizamos
            this.shipmentService.EditObj(existe).subscribe(result => {
              if(result.success){
                //this.toastEvoke.success(`SHIPMENT ${facturaSelected.shipmentID}`, 'You work has been saved').subscribe();
                index++;
                this.sendFacturas(index);
              }else{
                this.toastEvoke.danger(`ERROR SAVE ${result.code}`, result.message).subscribe();
                this.canEdit = true;
              }
            });
          }
        }
      }
    });
  }


  closeProgressPDF(event: ResponseHelper){
    this.iniciarDescarga = event.success;
    let modelo = {
      fileRaw: event.helper,
      fileName: "rate_confirmation.pdf",
      ID: this.tripID,
    };

    this.tripService.CreateRateConfirmation(modelo).subscribe(result => {
      if(result['success']){
        this.toastEvoke.success(`CREATED`, `${modelo.fileName} CREATED`).subscribe();

        this.pdfRate = result.helper != null ? result.helper['url'] : '';
      }else{
        this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
      }
    });
  }

  showRateConfirmationPDF(){
    if(this.pdfRate != null && this.pdfRate.length >0){
      return true;
    }
    return false;
  }


  getCarrierSelected() {
    if(this.addForm.get('CARRIER').value != null && this.addForm.get('CARRIER').value.length > 0){
      let params = { 'MC' : this.addForm.get('CARRIER').value };
      this.carrierService.getBy(params).subscribe(carrier => {
        if(carrier != null && carrier.length == 1){
          let houseNumber = carrier[0]['HOUSENUMBER'] != null ? carrier[0]['HOUSENUMBER'] : '';
          let street = carrier[0]['STREET'] != null ? carrier[0]['STREET'] : '';
          let adress = carrier[0]['ADRESS'] != null ? carrier[0]['ADRESS'] : '';

          let carrierSelected: ICarrierVM = {
            carrier: carrier[0]['NAME'],
            mc: carrier[0]['MC'],
            address: `${houseNumber} ${street} ${adress}`,
            city: carrier[0]['CITY'] != null ? carrier[0]['CITY'] : "",
            phone: carrier[0]['PHONE'] != null ? carrier[0]['PHONE'] : "",
            fax: '',
            contact: carrier[0]['CONTACT'] != null ? carrier[0]['CONTACT'] : "",
          };
          this.truckBrokers.carrierSelected = carrierSelected;
        }
      });
    }
  }

  getTransportType(code: string){
    let transport: string = '';
    switch (code) {
      case '0':
        transport = 'FTL';
        break;
      case '1':
      transport = 'LTL';
        break;
      default:
      transport = '';
        break;
    }
    return transport;
  }

  addFiles(array_files: string[]){
    this.tripFiles = [];
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
      this.tripFiles = listFiles;
    }
  }

  validarcampos(campo: string, i: number) {
    let valor: string = campo.toLowerCase();
    if(this.addForm.get(campo)?.errors?.['required'] && this.addForm.get(campo)?.touched){
      this.vs.messages[i] = this.vs.getrequired(valor);
      return true;
    }else if(this.addForm.get(campo)?.errors?.['nomanager'] && this.addForm.get(campo)?.touched){
      this.vs.messages[i] = this.vs.nomanager;
      return true;
    }else  if(this.addForm.get(campo)?.errors?.['noselected'] && this.addForm.get(campo)?.touched){
      this.vs.messages[i] = this.vs.getrequired(valor);
      return true;
    }
    return false;
  }

  createObj(closeScreen: boolean, shipment: boolean = false) {
    if(this.addForm.invalid){
      this.addForm.markAllAsTouched();
      this.toastEvoke.warning('INVALID FORM', 'Review your entries and try again.');
      return;
    }

    this.ObjServiceService.CreateObj(this.addForm.value)
    .subscribe(result => {
      if(result.success){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {

          if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
            this.isLoading[0] = false;
            this.vs.finalizar("protector");
            this.router.navigate(['./trips']);
          }else{
            //obtenemos el id por el UUID
            let params = { "TUUID": this.addForm.get("TUUID").value }
            this.tripService.getBy(params).subscribe(data => {
              if(shipment){
                this.isLoading[2] = false;
                this.vs.finalizar("protector");
              }else{
                this.isLoading[1] = false;
                this.vs.finalizar("protector");
              }

              if(Array.isArray(data)){
                //significa que encontro coincidencia
                if(data.length == 1){
                  this.tripID = data[0].TRIPID.toString();
                  if(shipment){
                    this.watchAddShipment = true;
                  }
                }else{
                  this.toastEvoke.warning(`ERROR TRIP 0`, "TRIP NO FOUND, contact your admin, please.").subscribe();
                }
              }else{
                this.toastEvoke.warning(`ERROR TRIP ${data.code}`, data.message).subscribe();
              }
            });
          }
        });
      }else{
        this.toastEvoke.warning(`ERROR ${result.code}`, result.message).subscribe();
      }
    });
  }

  actionsave(addForm: FormGroup, closeScreen: boolean, billed: boolean = false) {
    if(this.addForm.invalid){
      this.addForm.markAllAsTouched();
      this.toastEvoke.warning('INVALID FORM', 'Review your entries and try again.');
      return;
    }
    
    //edit
    if(closeScreen){
      this.isLoading[0] = true;
      this.vs.inicializar("protector");
    }else{
      this.isLoading[1] = true;
      this.vs.inicializar("protector");
    }

    if(this.tripID != null && this.tripID.length > 0){
      this.addForm.setControl('TRIPID', new FormControl(this.tripID));
      this.ObjServiceService.EditObj(addForm.value)
      .subscribe(result => {
        if(closeScreen){
          this.isLoading[0] = false;
          this.vs.finalizar("protector");
        }else{
          this.isLoading[1] = false;
          this.vs.finalizar("protector");
        }
        if(billed){
          this.isLoading[4] = false;
        }
        
        if(result.success){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1300
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
              this.router.navigate(['./trips']);
            }else{
              //en caso de que los carriers han sido modificados
              if(this.carriersSelect.some(x => x.field === 'CARRIER')){
                let carrierSelected = this.carriersSelect.find(x => x.field === 'CARRIER');
                let ovsSelected = this.fieldsOVS.find(x => x.field === 'CARRIER');
                if(carrierSelected.value != ovsSelected.id){
                  carrierSelected.value = ovsSelected.id;
                  carrierSelected.text = ovsSelected.name;
                }
              }

              if(this.carriersSelect.some(x => x.field === 'SECONDCARRIER')){
                let carrierSelected = this.carriersSelect.find(x => x.field === 'SECONDCARRIER');
                let ovsSelected = this.fieldsOVS.find(x => x.field === 'SECONDCARRIER');
                if(carrierSelected.value != ovsSelected.id){
                  carrierSelected.value = ovsSelected.id;
                  carrierSelected.text = ovsSelected.name;
                }
              }
            }
          });
        }else{
          this.toastEvoke.warning(`ERROR ${result.code}`, result.message).subscribe();
        }
      });
    }else{
      //create
      this.createObj(closeScreen);
    }
  }

  actionWatchShipment(valor: boolean, id: string = ''){
    if(id != ''){
      this.shipmenIDSelected = id;
      this.watchAddShipment = valor;
    }else{
      //
      if(this.tripID == null || this.tripID.length == 0){
        this.isLoading[2] = true;
        this.vs.inicializar("protector");
        this.createObj(false, true);
      }else{
        this.shipmenIDSelected = '';
        this.watchAddShipment = valor;
      }
    }

    if(!valor){
      this.watchAddShipment = valor;
      this.loadShipments();
    }
  }


  mapeoFacturas(){
    this.isLoading[3] = true;
    this.canEdit = false;

    if(this.addForm.invalid){
      this.isLoading[3] = false;
      this.canEdit = true;
      this.addForm.markAllAsTouched();
      this.toastEvoke.warning('INVALID FORM', 'Review your entries and try again.');
      return;
    }

    this.sapFacturas.specialBill.case = 1;
    this.sapFacturas.specialBill.index = 10;
  }


  loadShipments(campo: string = '', esRelease: boolean = false, esPDF: boolean = false){
    if(esRelease){
      this.mapeoFacturas();
    }

    this.sapFacturas.items = [];
    this.sapFacturas.proveedors = [];

    if(this.tripID != null && this.tripID.length > 0){
      let modelo = { "TRIPID": this.tripID}
      this.shipmentService.getBy(modelo).subscribe(data => {
        if(Array.isArray(data)){
          if(data.length > 0){
            this.listShipmentsOriginal = data;
            let listOrder = data.sort( (a,b)=> { return a['SHIPMENTID']-b['SHIPMENTID']; } );
            this.loadListShipments(listOrder, esRelease, esPDF, campo);
          }else{
            this.listShipmentsOriginal = [];
            this.listShipments = [];
          }
        }else{
          this.toastEvoke.warning(`ERROR LOAD SHIPMENTS ${data.code}`, data.message).subscribe();
        }
      });
    }else{
      this.listShipmentsOriginal = [];
      this.listShipments = [];
    }
  }

  async loadListShipments(list: any[], esRelease: boolean, esPDF: boolean, campo: string, listInterno: any[] = [],  index: number = 0){
    if(index < list.length){
      await this.loadShipment(index, list,listInterno,  list[index], esRelease, esPDF, campo);
    }else{
      console.log("FINISH LOAD SHIPMENTS");
      if(esRelease){
        let esValido: boolean = true;
        if(this.sapFacturas.items.length > 0){
          this.sapFacturas.items.forEach(factura => {
            let validado = factura.existPickUp && factura.existDelivery && factura.existCharges && factura.existCost;
            if(!validado){
              esValido = false;
              this.toastEvoke.info(`SHIPMENT ${factura.client.DocumentID}`,
              "The shipment must have at least one pickup, one delivery, one carrier cost and one customer charges").subscribe();
            }
          });
          if(!esValido){
            this.isLoading[3] = false;
            this.canEdit = true;
            return;
          }
        }
  
        let totalFacturaProveedor = this.sapFacturas.sum - this.sapFacturas.rest;
        if(totalFacturaProveedor <= 0){
          this.isLoading[3] = false;
          this.canEdit = true;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `We find a negative value: ${totalFacturaProveedor}, review yours carrier cost`,
            showConfirmButton: false,
            timer: 1600
          });
          return;
        }

        if(this.sapFacturas.specialBill.case === 3){
          this.sapFacturas.items.push({
            special: true,
            shipmentID: 0,
            client: this.sapFacturas.specialBill.client,
            existDelivery: true,
            existPickUp: true,
            existCost: true,
            existCharges: true
          });

          this.sapFacturas.proveedors.push({
            special: true,
            proveedor: this.sapFacturas.specialBill.proveedor,
            existError: false,
            errorMessage: ''
          });
        }


        if(this.sapFacturas.proveedors.length > 0){
          this.sapFacturas.proveedors.forEach(proveedor => {
            proveedor.proveedor.GrossAmount = totalFacturaProveedor;
          });

          let noSpecial = this.sapFacturas.proveedors.find(x => !x.special);

          if(noSpecial != null){
            if(noSpecial.proveedor.Items.some(x => x.BTDITypeCode && (x.CostObjectID == '' || x.AccountingCodingBlockTypeCode == ''))){
              this.isLoading[3] = false;
              this.canEdit = true;
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Some company and second dispatcher don\'t have a valid information, review your entries and try again.`,
                showConfirmButton: false,
                timer: 1600
              });
              return;
            }
          }

        }
        this.validarFacturas();
      }else{
        if(listInterno.length > 0){
          this.listShipments = listInterno.sort( (a,b)=> { return a['SHIPMENTID']-b['SHIPMENTID']; } );
        }
        if(this.listShipments.length > 0 && campo.length > 0){
          this.listFilterShipments = this.listShipments;
          this.filterShipments(campo);
        }
        this.isFinishLoad = true;
      }
    }
  }

  async loadShipment(index: number, list: any[], listInterno: any[], item: any, esRelease: boolean, esPDF: boolean, campo: string){
    let first: boolean = false;
    let companySelected = null;
    let companyCarrierSelected = null;

    if(esRelease){
      if(index === 0){
        first = true;
      }

      if(first){
        //validamos el carrier con el company 
        let validateForm = { CARRIERID: this.addForm.get('CARRIER')?.value, COMPANYID: this.addForm.get('COMPANY')?.value }
        let sceneCarrier =  await this.tripService.ValidateCarrier(validateForm);
        if(sceneCarrier['success']){
          switch(sceneCarrier['message']){
            case '2': 
              this.sapFacturas.specialBill.case = 2;
            break;
          case '3':
              this.sapFacturas.specialBill.case = 3;
          break;
          }
        }
      }
      let existSecondDispatcher = item['SECDISPATCHER'] != null && item['SECDISPATCHER'].length > 0 && item['SECDISPATCHER'] !== 'null';

      if(this.sapFacturas.specialBill.case == 3){
        let params = { COMPANY: this.addForm.get('CARRIER').value, 
          USER_ID: existSecondDispatcher ? item['SECDISPATCHER'] : this.addForm.get('AGENT').value }
        let secondCompany = await this.detailsService.getSecDispatcher(params);
        companyCarrierSelected = secondCompany;
      }else{
        companyCarrierSelected = null;
      }

      if(existSecondDispatcher){
        let params = { COMPANY: this.addForm.get('COMPANY').value, USER_ID: item['SECDISPATCHER'] }
        let secDispatcherResult = await this.detailsService.getSecDispatcher(params);
        if(secDispatcherResult != null){
          companySelected = secDispatcherResult;
        }
        
      }else{
        companySelected = this.sapFacturas.companySelected;
      }
    }
    let params = {  "TRIPID": this.tripID, "SHIPMENTID": item['SHIPMENTID']  };

    //buscamos
    let pickupResult = await this.pickupService.getByPromise(params);
    let deliveryResult = await this.deliveryService.getByPromise(params);
    let carriersResult = await this.carrierCostService.getByPromise(params);
    let customerChargesResult =  await this.customerChargesService.getByPromise(params);

    if(pickupResult != null && pickupResult['success'] &&  deliveryResult != null && deliveryResult['success'] && 
      carriersResult != null && carriersResult['success'] && customerChargesResult != null && customerChargesResult['success'] ){

        let deliverySelected = deliveryResult['helper'] != null ? deliveryResult['helper'] : null;
        let pickUpSelected = pickupResult['helper'] != null ? pickupResult['helper'] : null;
        let carrierCostSelected = carriersResult['helper'] != null ? carriersResult['helper'] : null;
        let customerchangesSelected = customerChargesResult['helper'] != null ? customerChargesResult['helper'] : null;

        let y: IRowFactura = {
          row: item,
          delivery: deliverySelected,
          pickup: pickUpSelected,
          carriercost: carrierCostSelected,
          customerchanges: customerchangesSelected,
          total: list.length - 1,
          index: index,
          companySelected: companySelected,
          first: first,
          companyCarrier: companyCarrierSelected
        }
    
        if((esRelease || esPDF) && first){
          this.rellenarPDF(item, deliverySelected, pickUpSelected, carrierCostSelected);
        }
    
        if(esRelease){
          this.rellenarFactura(y);
        }else{
          let modelo = {}
          this.columnsShipment.forEach( column => {
            if(column.key != null && column.key.length > 0){
              modelo[column.key] = '';
              switch(column.key){
                case 'CUSTOMER':
                  modelo[column.key] = item['NAMECS'];
                break;
                case 'PICKUPDATETIME':
                  if(pickUpSelected != null){
                    modelo['PICKUPDATETIME'] = this.datePipe.transform(pickUpSelected['PICKDATE'], 'MMMM dd, yyyy HH:mm');
                    modelo['CITYFROM'] = pickUpSelected['CITY'];
                  }
                break;
                case 'DELIVERYDATETIME':
                  if(deliverySelected != null){
                    //facturaItem.proveedor.Date = this.datePipe.transform(delivery['DELIVERYDATE'],'yyyy-MM-dd');
                    modelo['DELIVERYDATETIME'] = this.datePipe.transform(deliverySelected['DELIVERYDATE'], 'MMMM dd, yyyy HH:mm');
                    modelo['CITYTO'] = deliverySelected['CITY'];
      
                  }
                break;
                case 'COST':
                  modelo[column.key] = "0";
                  if(carrierCostSelected != null && Array.isArray(carrierCostSelected) && carrierCostSelected.length > 0){
                    let sum = 0;
                    let rest = 0;
                    carrierCostSelected.forEach(carrier => {
                      let category = this.getCategoryByCodeCarrierCost(carrier['CATEGORY']);
                      if(category != null && category['TYPE'] !== '003'){
                        sum +=  parseFloat(carrier['AMOUNT']);
                      }else{
                        rest +=  parseFloat(carrier['AMOUNT']);
                      }
      
                    });
                    modelo[column.key] = sum - rest;
                  }
                break;
                case 'REVENUE':
                  modelo[column.key] = "0";
                  if(customerchangesSelected != null && Array.isArray(customerchangesSelected) && customerchangesSelected.length > 0){
                    let sum = 0;
                    customerchangesSelected.forEach(charge => {
                      sum += parseFloat(charge['AMOUNT']);
                    });
                    modelo[column.key] = sum;
                  }
                break;
                case 'CUSTOMERINVOICE':
                  if(item[column.key] != null && item[column.key].length > 0){
                    modelo['CANEDIT'] = false;
                    modelo[column.key] = item[column.key];
                  }else{
                    modelo[column.key] = '';
                    modelo['CANEDIT'] = true;
                  }
                  break;
                default:
                  if(item[column.key] != null){
                    modelo[column.key] = item[column.key];
                  }else{
                    modelo[column.key] = '';
                  }
                break;
              }
            }
          });
      
          if(item['CUSTOMERINVOICE'] == null || item['CUSTOMERINVOICE'].length == 0){
           this.sapFacturas.exist++;
          }
          listInterno.push(modelo);
        }

        index++;
        this.loadListShipments(list, esRelease,esPDF, campo, listInterno, index);
    }
  }

  rellenarFactura(x: IRowFactura){
    if(this.sapFacturas.specialBill.case === 3 && x.first){
      let company = x.companyCarrier != null ? x.companyCarrier : x.companySelected;
      this.sapFacturas.specialBill.client = {
        DocumentID: `TR${this.tripID}-${x.row['SHIPMENTID']}-2`, //PENDIENTE
        Name: `Trip #${this.tripID}`,
        ProposedInvoiceDate: '',
        BuyerParty: this.addForm.get('COMPANY')?.value != null ? this.addForm.get('COMPANY')?.value : '',
        BillFromParty: this.addForm.get('CARRIER')?.value != null ? this.addForm.get('CARRIER')?.value : '',
        SalesUnitParty: this.addForm.get('CARRIER')?.value != null ? this.addForm.get('CARRIER')?.value : '',
        EmployeeResponsibleParty: company != null && company['BYD_EMPLOYEE'] != null
          ? company['BYD_EMPLOYEE'] : '', 
        CurrencyCode: 'USD',
        PONumber: x.row['CUSTOMERPO'] != null ?x. row['CUSTOMERPO'] : "", 
        DeliveryDate: x.delivery != null ? this.datePipe.transform(x.delivery['DELIVERYDATE'],'yyyy-MM-dd') : "",
        Items: [],
        ExtReference: `TRIP-${this.tripID}`,
      };

      this.sapFacturas.specialBill.proveedor = {
        MEDIUM_Name: `Trip #${this.tripID}`,
        Date: '',
        GrossAmountCurrency: 'USD',
        GrossAmount: 0,
        BusinessTransactionDocumentReference: `TRIP-${this.tripID}`,
        BuyerParty: this.addForm.get('COMPANY')?.value != null ? this.addForm.get('COMPANY')?.value : '',
        SellerParty: this.addForm.get('CARRIER')?.value,
        PODNumber: x.row['CUSTOMERPO'] != null ? x.row['CUSTOMERPO'] : "",
        Items: [],
      }

    }else if(this.sapFacturas.specialBill.case != 3){
      this.sapFacturas.specialBill.proveedor = null;
      this.sapFacturas.specialBill.client = null;
    }


    let facturaItem: IFacturaItem = {
      special: false,
      shipmentID: x.row['SHIPMENTID'],
      client: {
        DocumentID: `TR${this.tripID}-${x.row['SHIPMENTID']}${this.sapFacturas.specialBill.case === 3 ? "-1": ""}`,
        Name: `Trip #${this.tripID}`,
        ProposedInvoiceDate: '',
        BuyerParty: '',
        BillFromParty: this.addForm.get('COMPANY')?.value != null ? this.addForm.get('COMPANY')?.value : '',
        SalesUnitParty: this.addForm.get('COMPANY')?.value != null ? this.addForm.get('COMPANY')?.value : '',
        EmployeeResponsibleParty: x.companySelected != null && x.companySelected['BYD_EMPLOYEE'] != null
          ? x.companySelected['BYD_EMPLOYEE'] : '',
        CurrencyCode: 'USD',
        PONumber: x.row['CUSTOMERPO'] != null ?x. row['CUSTOMERPO'] : "",
        DeliveryDate: x.delivery != null ? this.datePipe.transform(x.delivery['DELIVERYDATE'],'yyyy-MM-dd') : "",
        Items: [],
        ExtReference: `TRIP-${this.tripID}`,
      },
      existDelivery: x.delivery != null,
      existPickUp: x.pickup != null,
      existCost: x.carriercost != null && Array.isArray(x.carriercost) && x.carriercost.length > 0,
      existCharges: x.customerchanges != null && Array.isArray(x.customerchanges) && x.customerchanges.length > 0,
    };

    if(x.first){
      this.sapFacturas.proveedors.push({
        special: false,
        proveedor: {
          MEDIUM_Name: `Trip #${this.tripID}`,
          Date: '',
          GrossAmountCurrency:'USD',
          GrossAmount: 0,
          BusinessTransactionDocumentReference: `TRIP-${this.tripID}`,
          BuyerParty: this.sapFacturas.specialBill.case === 3 ? this.addForm.get('CARRIER')?.value : this.addForm.get('COMPANY')?.value != null ? this.addForm.get('COMPANY')?.value : '',
          SellerParty: (this.sapFacturas.specialBill.case === 2 || this.sapFacturas.specialBill.case === 3) ? this.addForm.get('DRIVER')?.value : this.addForm.get('CARRIER').value,
          PODNumber: x.row['CUSTOMERPO'] != null ? x.row['CUSTOMERPO'] : "",
          Items: [],
        },

        existError: false,
        errorMessage: ''
      });

      this.sapFacturas.sum = 0;
      this.sapFacturas.rest = 0;
    }
    this.columnsShipment.forEach( column => {
      if(column.key != null && column.key.length > 0){
        switch(column.key){
          case 'CUSTOMER':
            facturaItem.client.BuyerParty = x.row[column.key];
          break;
          case 'PICKUPDATETIME':
            if(x.pickup != null){
              facturaItem.client.ProposedInvoiceDate = this.datePipe.transform(x.pickup['PICKDATE'],'yyyy-MM-dd');
              if(x.first){
                this.sapFacturas.proveedors[0].proveedor.Date = this.datePipe.transform(x.pickup['PICKDATE'],'yyyy-MM-dd');

                if(this.sapFacturas.specialBill.case === 3){
                  this.sapFacturas.specialBill.proveedor.Date = this.datePipe.transform(x.pickup['PICKDATE'],'yyyy-MM-dd');
                  this.sapFacturas.specialBill.client.ProposedInvoiceDate = this.datePipe.transform(x.pickup['PICKDATE'],'yyyy-MM-dd');
                }

              }
            }
          break;
          case 'COST':
            if(x.carriercost != null && Array.isArray(x.carriercost) && x.carriercost.length > 0){
              x.carriercost.forEach(carrier => {
                let category = this.getCategoryByCodeCarrierCost(carrier['CATEGORY']);
                //obtener de la lista de categorias
                let company = x.companyCarrier != null ? x.companyCarrier : this.sapFacturas.companySelected;

                this.sapFacturas.proveedors[0].proveedor.Items.push({
                  NetAmountCurrency: 'USD',
                  NetAmount: carrier['AMOUNT'],
                  ProductTypeCode: 1,
                  ProductIdentifierTypeCode: 1,
                  ProductID: carrier['CATEGORY'],
                  AmountCurrency: 'USD',
                  Amount: carrier['AMOUNT'],
                  Quantity: 1,
                  QuantityUnit: 'EA',
                  CostObjectID: company!= null && company['COSTOBJECT'] != null ? company['COSTOBJECT'] : '',
                  AccountingCodingBlockTypeCode: company!= null && company['ACCASSIGMENT'] != null ? company['ACCASSIGMENT'] : '',
                  BTDITypeCode: category != null ? category['TYPE'] : '',
                });

                if(this.sapFacturas.specialBill.case === 3){

                  this.sapFacturas.specialBill.proveedor.Items.push({
                    NetAmountCurrency: 'USD',
                    NetAmount: carrier['AMOUNT'],
                    ProductTypeCode: 1,
                    ProductIdentifierTypeCode: 1,
                    ProductID: carrier['CATEGORY'],
                    AmountCurrency: 'USD',
                    Amount: carrier['AMOUNT'],
                    Quantity: 1,
                    QuantityUnit: 'EA',
                    CostObjectID: x.companySelected != null && x.companySelected['COSTOBJECT'] != null
                      ? x.companySelected['COSTOBJECT'] : '',
                    AccountingCodingBlockTypeCode: x.companySelected != null && x.companySelected['ACCASSIGMENT'] != null
                      ? x.companySelected['ACCASSIGMENT'] : '',
                    BTDITypeCode: category != null ? category['TYPE'] : '',
                  });
                }

                if(category != null && category['TYPE'] !== '003'){
                  this.sapFacturas.sum += parseFloat(carrier['AMOUNT']);
                }else{
                  this.sapFacturas.rest += parseFloat(carrier['AMOUNT']);
                }
              });

            }
          break;
          case 'REVENUE':
            if(x.customerchanges != null && Array.isArray(x.customerchanges) && x.customerchanges.length > 0){
              
              let index: number = 10;
              let listChargesClient: FacturaItemClient[] = [];

              x.customerchanges.forEach(charge => {

                listChargesClient.push({
                  ItemID: index,
                  InternalID: charge['CATEGORY'],
                  Quantity: 1,
                  QuantityTypeCode: 'EA',
                  DecimalValue: charge['AMOUNT'],
                  CurrencyCode: 'USD',
                  BaseDecimalValue: 1,
                  BaseMeasureUnitCode: 'EA',
                  CostObjectID: x.companySelected != null && x.companySelected['COSTOBJECT'] != null
                  ? x.companySelected['COSTOBJECT'] : '',
                  AccountingCodingBlockTypeCode: x.companySelected != null && x.companySelected['ACCASSIGMENT'] != null
                  ? x.companySelected['ACCASSIGMENT'] : '',
                  DeliveryDate: x.delivery != null ? this.datePipe.transform(x.delivery['DELIVERYDATE'],'yyyy-MM-dd') : "",
                });
                index+=10;

                if(this.sapFacturas.specialBill.case == 3){
                  let company = x.companyCarrier != null ? x.companyCarrier : x.companySelected;
                  this.sapFacturas.specialBill.client.Items.push({
                    ItemID: this.sapFacturas.specialBill.index,
                    InternalID: charge['CATEGORY'],
                    Quantity: 1,
                    QuantityTypeCode: 'EA',
                    DecimalValue: charge['AMOUNT'],
                    CurrencyCode: 'USD',
                    BaseDecimalValue: 1,
                    BaseMeasureUnitCode: 'EA',
                    CostObjectID: company != null && company['COSTOBJECT'] != null
                    ? company['COSTOBJECT'] : '',
                    AccountingCodingBlockTypeCode: company != null && company['ACCASSIGMENT'] != null
                    ? company['ACCASSIGMENT'] : '',
                    DeliveryDate: x.delivery != null ? this.datePipe.transform(x.delivery['DELIVERYDATE'],'yyyy-MM-dd') : "",
                  });

                  this.sapFacturas.specialBill.index +=10;
                }

                
              });

              facturaItem.client.Items = listChargesClient;
            }
          break;
        }
      }
    });
    if(x.row['CUSTOMERINVOICE'] == null || x.row['CUSTOMERINVOICE'].length == 0){
      this.sapFacturas.items.push(facturaItem);
    }
  }

  rellenarPDF(row: any, delivery: any,pickup: any,carriercost: any[]){
    this.columnsShipment.forEach( column => {
      if(column.key != null && column.key.length > 0){
        switch(column.key){
          case 'CUSTOMER':
            this.truckBrokers.customer = row['NAMECS'];
          break;
          case 'PICKUPDATETIME':
            if(pickup != null){
              let housePickup = pickup['HOUSENUMBER'] != null && pickup['HOUSENUMBER'].length > 0 ? pickup['HOUSENUMBER'] : "";
              let streetPickup = pickup['STREET'] != null && pickup['STREET'].length > 0 ? pickup['STREET'] : "";
              let addressPickup = pickup['ADRESS'] != null && pickup['ADRESS'].length > 0 ? pickup['ADRESS'] : "";

              let pickUpSelected: IPickUpVM =  {
                address1: `${housePickup} ${streetPickup} ${addressPickup}`,
                address2: pickup['ADRESS2'] != null && pickup['ADRESS2'].length > 0 ? pickup['ADRESS2'] : "",
                city: pickup['CITY'] != null &&  pickup['CITY'].length > 0 ?  pickup['CITY'] : "",
                zipcode: pickup['ZIPCODE'] != null && pickup['ZIPCODE'].length > 0 ?  pickup['ZIPCODE'] : "",
                phone: pickup['PHONE'] != null && pickup['PHONE'].length > 0 ? pickup['PHONE'] : "",
                commodity: pickup['DESCRIPTIONCOMM'] != null ? pickup['DESCRIPTIONCOMM'] : "",
                pickUpDate: this.datePipe.transform(pickup['PICKDATE'], 'MMMM dd, yyyy'),
                pickUpTime: this.datePipe.transform(pickup['PICKDATE'], 'HH:mm'),
                pickUpRef: pickup['PICKUPREF'] != null && pickup['PICKUPREF'].length > 0 ? pickup['PICKUPREF'] :  "",
                contact: pickup['CONTACT'] != null && pickup['CONTACT'].length > 0 ? pickup['CONTACT'] : "",
                pcsweight:  pickup['PIECES'] + ' / '+ pickup['WEIGHT'],
                notes: pickup['NOTES'] != null && pickup['NOTES'].length > 0 ? pickup['NOTES'] : "",
                seal: pickup['SEAL'] != null && pickup['SEAL'].length > 0 ? pickup['SEAL'] : "",
              }
              this.truckBrokers.pickUp = pickUpSelected;
            }
          break;
          case 'DELIVERYDATETIME':
            if(delivery != null){
              let houseDelivery = delivery['HOUSENUMBER'] != null && delivery['HOUSENUMBER'].length > 0 ? delivery['HOUSENUMBER'] : "";
              let streetDelivery = delivery['STREET'] != null && delivery['STREET'].length > 0 ? delivery['STREET'] : "";
              let addressDelivery = delivery['ADRESS'] != null && delivery['ADRESS'].length > 0 ? delivery['ADRESS'] : "";

              let pickUpSelected: IDeliveryVM =  {
                address1: `${houseDelivery} ${streetDelivery} ${addressDelivery}`,
                address2: delivery['ADRESS2'] != null && delivery['ADRESS2'].length > 0 ? delivery['ADRESS2'] : "",
                city: delivery['CITY'] != null && delivery['CITY'].length > 0 ? delivery['CITY'] : "",
                zipcode: delivery['ZIPCODE'] != null && delivery['ZIPCODE'].length > 0 ? delivery['ZIPCODE'] : "",
                phone: delivery['PHONE'] != null && delivery['PHONE'].length > 0 ? delivery['PHONE'] : "",
                contact: delivery['CONTACT'] != null &&  delivery['CONTACT'].length > 0 ?  delivery['CONTACT'] : "",
                pcsweight: delivery['PIECES'] + ' / ' + delivery['WEIGHT'],
                notes: delivery['NOTES'] != null &&  delivery['NOTES'].length > 0 ?  delivery['NOTES'] : "",
                deliveryDate: this.datePipe.transform(delivery['DELIVERYDATE'], 'MMMM dd, yyyy'),
                deliveryTime: this.datePipe.transform(delivery['DELIVERYDATE'], 'HH:mm'),
                deliveryRef: delivery['DROPOFFREF'] != null && delivery['DROPOFFREF'].length > 0 ? delivery['DROPOFFREF'] : "",
              };
              this.truckBrokers.delivery = pickUpSelected;
            }
          break;
          case 'COST':
            if(carriercost != null && Array.isArray(carriercost) && carriercost.length > 0){
              let list: ICarrierCostVM[] = [];

              carriercost.forEach(carrier => {

                let category = this.getCategoryByCodeCarrierCost(carrier['CATEGORY']);
                //obtener de la lista de categorias
                
                list.push({
                  service: category != null ? category['DESCRIPTION'] : '',
                  notes: carrier['NOTES'],
                  payment: carrier['AMOUNT']
                });
              });
              this.truckBrokers.carriers = list;
            }
          break;
        }
      }
    });
  }

  searchShipments(event: any){
    if(event != null &&  event.target != null && event.target.highlightValue != null && event.target.highlightValue.length > 0){
      let search: string = event.target.highlightValue;
      this.loadShipments(search);
    }else{
      this.loadShipments();
    }
  }

  filterShipments(campo: string){
    if(this.listShipments != null && this.listShipments.length > 0){
      let filterList = this.listShipments;
      filterList = filterList.filter( item => {
        let itemValues: string[] = Object.values(item);
        let prueba = JSON.stringify(itemValues).toLowerCase().indexOf(campo.toLowerCase()) > -1 ? 1 : 0;
        return prueba > 0;
      });
      this.listShipments = filterList;
    }
  }


  confirmDelete(id: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let params = { "SHIPMENTID": id };

        this.shipmentService.deleteBy(params).subscribe(result => {
          if(result['success']){
            Swal.fire({
              title: 'Deleted!',
              text: 'Your work has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1300,
            });
            this.loadShipments();
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }
    })
  }

  //event del shipment
  getTripID(event: string){
    if(this.tripID == null || this.tripID.length == 0){
      this.tripID = event;
    }
  }

  //suggestions
  //filtrado de las suggestions
  loadSuggestions(){
    if(this.listMSelected.length > 0 && this.valueField != null && this.valueField.length > 0){
      this.listSuggestionsM = this.listMSelected.filter( item => {
        let itemValues: string[] = Object.values(item);
        //let jsonItem = JSON.stringify(itemValues);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a > 0;
      });
    }
  }
  //modal
  //evento de respuesta cuando el modal se cierra
  closeModalDropdown(event: boolean){
    this.watchOVS = event;
  }

  //definición de las columnas para la lista.
  listSelected(index: number, actualizar: boolean = false, suggestions: boolean = false){
    this.columnsSelected = [];

    if(!actualizar || suggestions){
      this.fieldOVSSelected = this.fieldsOVS[index];
      this.valueField = this.fieldsOVS[index].name;
    }
    switch(this.fieldsOVS[index].title){
      case 'DRIVER': case 'SECOND DRIVER':
        this.columnsSelected.push({name: 'DRIVER ID', key: 'driverid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.filterSearch = 'driverid';
        this.getList(this.driverService,actualizar,suggestions);
        break;
        case 'TRUCK': case 'SECOND TRUCK':
        this.columnsSelected.push({name: 'TRUCK NUMBER', key: 'trucknumber',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'MAKE', key: 'make',style: '', isID: false,isNAME: true });
        this.columnsSelected.push({name: 'NOTES', key: 'notes',style: '', isID: false,isNAME: false });
         this.filterSearch = 'trucknumber';
        this.getList(this.truckService,actualizar,suggestions);
        break;
        case 'TRAILER': case 'SECOND TRAILER':
          this.columnsSelected.push({name: 'TRAILER NUMBER', key: 'trailernumber',style: '', isID: true,isNAME: false });
          this.columnsSelected.push({name: 'MAKE', key: 'make',style: '', isID: false,isNAME: true });
          this.columnsSelected.push({name: 'NOTES', key: 'notes',style: '', isID: false,isNAME: false });
          this.filterSearch = 'trailernumber';
        this.getList(this.trailerService,actualizar,suggestions);
        break;

        case 'CARRIER': case 'SECOND CARRIER':
            this.columnsSelected.push({name: 'MC', key: 'mc',style: '', isID: true,isNAME: false });
            this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
            this.columnsSelected.push({name: 'NOTES', key: 'notes',style: '', isID: false,isNAME: false });
            this.columnsSelected.push({name: 'INSURANCEEXPDATE', key: 'insuranceexpdate',style: '', isID: false,isNAME: false });
            this.filterSearch = 'mc';
          this.getList(this.carrierService,actualizar,suggestions);
          break;

        case 'EQUIPMENT TYPE':
          this.columnsSelected.push({name: 'EQUIPMENT TYPE ID', key: 'equipmenttypeid',style: '', isID: true,isNAME: false });
          this.columnsSelected.push({name: 'DESCRIPTION', key: 'description',style: '', isID: false,isNAME: true });
          this.filterSearch = 'equipmenttypeid';
          this.getList(this.equipmentTypesService,actualizar,suggestions);
          break;
          case 'COMPANY':
          this.columnsSelected.push({name: 'COMPANY', key: 'company',style: '', isID: true,isNAME: false });
          this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
          this.filterSearch = 'company';
          this.getList(this.companyService,actualizar,suggestions);
          break;
    }
  }

  //cuando se detecta que el usuario se encuentra en el input y cuando va escribiendo en el input
  onChange(event: any, index: number): void {
    this.listSuggestionsM = [];
    this.listMSelected = [];
    if(this.fieldsOVS[index].name != null && this.fieldsOVS[index].name.length > 0){
      this.listSelected(index, true, true);
    }else{
      if(this.fieldsOVS[index].id != null && this.fieldsOVS[index].id != ''){
        if(this.fieldsOVS[index].field === 'SECONDCARRIER' || this.fieldsOVS[index].field === 'SECONDDRIVER' ||
          this.fieldsOVS[index].field === 'SECONDTRUCK' || this.fieldsOVS[index].field === 'SECONDTRAILER'){
          this.addForm.get(this.fieldsOVS[index].field).setValue('DUMMY');
          this.valueField = this.fieldsOVS[index].name;
          this.fieldsOVS[index].id = '';
        }else{
          this.addForm.get(this.fieldsOVS[index].field).setValue('');
          this.valueField = this.fieldsOVS[index].name;
          this.fieldsOVS[index].id = '';
        }
      }

      if((this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER')
      && this.carriersSelect.length > 0  && this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field)){
        let carrierfound = this.carriersSelect.findIndex(x => x.field === this.fieldsOVS[index].field);
        this.carriersSelect.splice(carrierfound,1);
      }

    }
  }

  //cuando el usuario cambia de input, verifica si hay coincidencia si lo hay, lo guarda
  sinEscribir(event: any, index: number){
    if(this.listSuggestionsM.length > 0 ){
      let itemSelected = this.listSuggestionsM.find(x => {
        let itemValues: string[] = Object.values(x);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a
      });
      if(itemSelected != null){
        if(this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER'){
          let expired = this.isExpiredDate(itemSelected["mc"]);
  
          if(expired){
            this.fieldsOVS[index].name = "";
            this.fieldsOVS[index].id = "";
            this.addForm.get(this.fieldsOVS[index].field).setValue("");
            return;
          }
        }
        
        if(this.fieldsOVS[index].id == null || this.fieldsOVS[index].id == '' || itemSelected[this.filterSearch] != this.fieldsOVS[index].id ){
          let newID = '';
          let newName = '';

          this.columnsSelected.forEach(column => {
            if(column.isID){
              newID = itemSelected[column.key];
            }else if(column.isNAME){
              newName = itemSelected[column.key];
            }
          });

          if(newID != null && newID != this.fieldsOVS[index].id ){
            this.fieldsOVS[index].id = newID;
            this.fieldsOVS[index].name = newName;
            this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
          }

          if((this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER')
          && (this.carriersSelect.length == 0  || !this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field))){
            this.carriersSelect.push({
              value: this.fieldsOVS[index].id,
              text: this.fieldsOVS[index].name,
              field: this.fieldsOVS[index].field,
              selected: false
            });
          }else if(this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field)){
            let carrierSelected = this.carriersSelect.find(x => x.field === this.fieldsOVS[index].field);
            // carrierSelected.value = this.fieldsOVS[index].id;
            // carrierSelected.text = this.fieldsOVS[index].name;
          }
          
          if(newID != null){
            if(this.fieldsOVS[index].field === 'COMPANY'){
              this.changeManagers(this.fieldsOVS[index].id);
            }else if(this.fieldsOVS[index].field === 'CARRIER'){
              this.getCarrierSelected();
            }
          }
        }
      }else{
          if((this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER')
            && this.carriersSelect.length > 0  && this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field)){
              let carrierfound = this.carriersSelect.findIndex(x => x.field === this.fieldsOVS[index].field);

              this.carriersSelect.splice(carrierfound,1);
          }

          if(
            this.fieldsOVS[index].field === 'DRIVER' || this.fieldsOVS[index].field === 'TRUCK' || this.fieldsOVS[index].field === 'TRAILER' ||
            this.fieldsOVS[index].field === 'SECONDCARRIER' || this.fieldsOVS[index].field === 'SECONDDRIVER' ||
            this.fieldsOVS[index].field === 'SECONDTRUCK' || this.fieldsOVS[index].field === 'SECONDTRAILER'){

              if(this.fieldsOVS[index].field === 'SECONDCARRIER'){
                this.addForm.get(this.fieldsOVS[index].field).setValue('DUMMY');
                this.fieldsOVS[index].id = '';
              }else{
                this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
                this.fieldsOVS[index].id = '';
              }
          }else{
            this.addForm.get(this.fieldsOVS[index].field).setValue('');
            this.fieldsOVS[index].id = '';
          }
      }
    }else{
      if(this.fieldsOVS[index].field === 'DRIVER' || this.fieldsOVS[index].field === 'TRUCK' || this.fieldsOVS[index].field === 'TRAILER' ||
         this.fieldsOVS[index].field === 'SECONDDRIVER' || this.fieldsOVS[index].field === 'SECONDTRUCK' || this.fieldsOVS[index].field === 'SECONDTRAILER'){

          this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
          this.fieldsOVS[index].id = '';
        }else{
          if(this.fieldsOVS[index].field === 'COMPANY'){
            this.changeManagers(this.fieldsOVS[index].id);
        }
        }
    }
  }

  //Guarda el valor del registro seleccionado en la lista del modal, en el formulario
  changeField(event: IItemSelectedModal){
    let fielOVS = this.fieldsOVS.find(x => x.field === event.field);
    if(fielOVS != null){

      if(fielOVS.field === 'CARRIER' || fielOVS.field === 'SECONDCARRIER'){
        let expired = this.isExpiredDate(event.id);
    
        if(expired){
            this.toastEvoke.danger(`insurance expired date`, `insurance expired date ${event.id}`).subscribe();
            fielOVS.name = "";
            fielOVS.id = "";
            this.addForm.get(event.field).setValue("");
            return;
          }
      }

      fielOVS.id = event.id.trim();
      fielOVS.name = event.name.trim();
      this.addForm.get(event.field).setValue(fielOVS.id);

      if((fielOVS.field === 'CARRIER' || fielOVS.field === 'SECONDCARRIER')
      && (this.carriersSelect.length == 0  || !this.carriersSelect.some(x => x.field === fielOVS.field))){
        this.carriersSelect.push({
          value: fielOVS.id,
          text: fielOVS.name,
          field: fielOVS.field,
          selected: false
        });
      }else if(this.carriersSelect.some(x => x.field === fielOVS.field)){
        let carrierSelected = this.carriersSelect.find(x => x.field === fielOVS.field);
        // carrierSelected.value = fielOVS.id;
        // carrierSelected.text = fielOVS.name;
      }

      if(fielOVS.field === 'COMPANY'){
        this.changeManagers(fielOVS.id);
      }else if(fielOVS.field === 'CARRIER'){
        this.getCarrierSelected();
      }
    }
  }

  suggestionSelected(event : any, index: number){
    if(event != null && event.source != null && event.source.selected){
      let element: ElementRef = event.source.element;
      let columns: DOMStringMap = element.nativeElement.dataset;
      let text : string = columns.name.trim();
      let value: string = columns.id.trim();
      
      if((this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER')){
        let expired = this.isExpiredDate(value);
    
          if(expired){
              this.toastEvoke.danger(`insurance expired date`, `insurance expired date ${value}`).subscribe();
              this.fieldsOVS[index].name = "";
              this.fieldsOVS[index].id = "";
              this.listSuggestionsM = [];
              this.addForm.get(this.fieldsOVS[index].field).setValue("");
              return false;
            }
        }

        this.fieldsOVS[index].name = text;
        this.fieldsOVS[index].id = value;
        this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
        this.valueField = text;
        
        if((this.fieldsOVS[index].field === 'CARRIER' || this.fieldsOVS[index].field === 'SECONDCARRIER')
        && (this.carriersSelect.length == 0  || !this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field))){
          
          this.carriersSelect.push({
            value: this.fieldsOVS[index].id,
            text: this.fieldsOVS[index].name,
            field: this.fieldsOVS[index].field,
            selected: false
          });
        }else if(this.carriersSelect.some(x => x.field === this.fieldsOVS[index].field)){
          let carrierSelected = this.carriersSelect.find(x => x.field === this.fieldsOVS[index].field);
          // carrierSelected.value = this.fieldsOVS[index].id;
          // carrierSelected.text = this.fieldsOVS[index].name;
        }

        if(this.fieldsOVS[index].field === 'COMPANY'){
          this.changeManagers(this.fieldsOVS[index].id);
        }else if(this.fieldsOVS[index].field === 'CARRIER'){
          this.getCarrierSelected();
        }
    }
  }


  //listas
  getList(service: any, actualizar: boolean = false, suggestions: boolean = false){
    let list: any = [];
    service.getAll().subscribe(data => {
      if(data != null && Array.isArray(data) &&  data.length > 0){
        data.forEach( (item, index) => {
          let model = {};
          this.columnsSelected.forEach(column => {
            model[column.key] = item[`${column.key.toUpperCase()}`];
          });
          list.push(model);
        });
      }
      this.listMSelected = list;
      if(!actualizar){
        this.watchOVS = true;
      }

      if(suggestions){
        this.loadSuggestions();
      }
    });
  }

  getOption(item: any, type: string){
    let id: string = '';
    let name: string = '';
    let result: string = '';
    this.columnsSelected.forEach(column => {
      if(column.isID){
        id = item[column.key];
      }else if(column.isNAME){
        name = item[column.key];
      }
    });

    switch(type){
      case 'ID': result = id; break;
      case 'NAME': result = name; break;
      case 'OPTION': result = `${id} - ${name}`; break;
    }

    return result;
  }


  changeManagers(company: string, actualizar: boolean = false){
    let agent = this.addForm.get('AGENT').value;
    if(company != null && company.length > 0 && agent != null && agent.length > 0){
      let params = { COMPANY: company, USER_ID: agent }
      this.detailsService.getBy(params).subscribe(result => {
        if(result != null && Array.isArray(result)){
          if(!actualizar){
            if(result != null && result.length == 1){
              this.addForm.get('VPOFSALE').setValue(result[0]['MANAGER']);
              this.sapFacturas.companySelected = result[0];
            }else{
              this.addForm.get('VPOFSALE').setValue('');
            }
          }else{
            if(result != null && result.length == 1){
              if(this.addForm.get('VPOFSALE').value != result[0]['MANAGER']){
                this.addForm.get('VPOFSALE').setValue(result[0]['MANAGER']);
              }
              this.sapFacturas.companySelected = result[0];
            }
          }
        }
        if(actualizar){
          this.loadShipments();
        }
      });
    }else{
      if(actualizar){
        this.loadShipments();
      }else{
        this.addForm.get('VPOFSALE').setValue('');
        this.sapFacturas.companySelected = null;
      }
    }
  }

  isExpiredDate(mc: string): boolean{
    let carrierData = this.listMSelected.find(elemet => elemet.mc == mc);

    if(carrierData?.insuranceexpdate != null && carrierData?.insuranceexpdate != ""){
      return new Date(carrierData.insuranceexpdate) < new Date();
    }
    return false;
  }
}
