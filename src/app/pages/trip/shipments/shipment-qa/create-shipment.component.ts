import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { ISpinner, IText } from 'src/app/components/btn/loading/loading.component';
import { IColumnTable } from 'src/app/models/list.viewmodel';
import { IColumnModal, IItemSelect, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
import { CarrierscostService } from 'src/app/services/carrierscostService/carrierscost.service';
import { CarrierServiceService } from 'src/app/services/carriersService/carrier-service.service';
import { CommodityServiceService } from 'src/app/services/commodityService/commodity-service.service';
import { ConsigneeaddressService } from 'src/app/services/consigneeaddressService/consigneeaddress.service';
import { CosigneeServiceService } from 'src/app/services/cosigneeService/cosignee-service.service';
import { CustomerChargeService } from 'src/app/services/customerChargeService/customer-charge.service';
import { CustomerServiceService } from 'src/app/services/customerService/customer-service.service';
import { DeliveriesService } from 'src/app/services/deliveriesService/deliveries.service';
import { PickupsService } from 'src/app/services/pickupsService/pickups.service';
import { ShipmentService } from 'src/app/services/shipmentService/shipment.service';
import { ShipperaddressServiceService } from 'src/app/services/shipperaddress/shipperaddress-service.service';
import { ShipperServiceService } from 'src/app/services/shipperService/shipper-service.service';
import { TripService } from 'src/app/services/tripService/trip.service';
import { UserfindetailsService } from 'src/app/services/userfindetailsService/userfindetails.service';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';


@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css'],
  providers: [DatePipe],
})
export class CreateShipmentComponent implements OnInit, OnDestroy {

  public RegionList: { name: string, code: string }[] = RegionCode;
  public CountryList: { name: string, code: string }[] = CountryCode;

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
  

  //uuid
  @Input() tripUUID: string = '';
  shipmentUUID: string = '';

  //permitir editar 
  @Input() canEdit: boolean = true;
  canEditShipment: boolean = true;

  @Input() formTrip: FormGroup = this.formBuilder.group({});

  //cuando ya existen, para no estar llamando el servicio a cada rato.
  @Input() shipmentID: string = '';
  @Input() tripID: string = '';

  //obtener el tripID
  @Output() actionGetTripID: EventEmitter<string> = new EventEmitter();

  //cerrar la pagina de shipment
  @Output() closeAddShipment: EventEmitter<boolean> = new EventEmitter();

  //modals
  @ViewChild("pickupModal") pickUpModal: ElementRef;
  @ViewChild("deliveryModal") deliveryModal: ElementRef;
  @ViewChild("carrierModal") carrierModal: ElementRef;
  @ViewChild("customerChargesModal") customerChargesModal: ElementRef;

  //lists 
  listPickUps: any = [];
  listDeliverys: any = [];
  listCarriers: any = [];
  listCustomerCharges: any = [];
  listUsers: any = [];

  //attachments
  shipmentFiles: FileVM[] = [];

  //save, + (pickup), + (delivery), + (carrier), + (customer)
  isLoading: boolean[] = [false, false, false, false, false];

  //columns
  columnsPickUps: IColumnTable[] = [ {title: 'Id', key: 'PICKUPID', type: 'TEXT', watch: false,},{ title: 'Shipper', key: 'SHIPPERID', type: 'TEXT', select: true }, 
  { title: 'PCs/Weight', key: 'PIECES', type: 'NUMBER'}, { title: 'Pick up Ref #', key: 'PICKUPREF', type: 'TEXT'}, 
  { title: 'Pick Up Date', key: 'PICKDATE', type: 'DATE'}, { title: 'E-P/U From', key: 'ETAFROM', type: 'DATE'}, { title: 'E-P/U To', key: 'ETATO', type: 'DATE'},  { title: 'Actions', key: '', type: 'TEXT' }   ];
 //{ title: 'Pick up Ref E-P/U', key: 'ETAFROM', type: 'DATE'}, 
  columnsDeliverys: IColumnTable[] =  [ {title: 'Id', key: 'DELIVERYID', type: 'TEXT', watch: false,},{ title: 'Consignee', key: 'CONSIGNEEID', type: 'TEXT',  select: true}, 
  { title: 'PCs/Weight', key: 'PIECES', type: 'NUMBER'}, { title: 'Drop off Ref #', key: 'DROPOFFREF', type: 'TEXT'}, 
  { title: 'Delivery Date', key: 'DELIVERYDATE', type: 'DATE'}, { title: 'Delivery ETA', key: 'DELIVERYETA', type: 'DATE'}, { title: 'Sign By', key: 'SIGNBY', type: 'TEXT'}, 
  { title: 'POD', key: 'LASTPODUPLOADBY', type: 'TEXT'},  {title: 'Upload Attachment', key: 'UPLOADATTACHMENT', type: 'TEXT', watch: false},   { title: 'Actions', key: '', type: 'TEXT' }   ];
    //{title: 'Create By', key: '', type: 'TEXT'},
  columnsCarriers: IColumnTable[] = 
  [ {title: 'Id', key: 'CARCOSTID', type: 'TEXT', watch: false,},{ title: 'Category', key: 'CATEGORY', type: 'TEXT', select: true}, 
    { title: 'Amount', key: 'AMOUNT', type: 'NUMBER'}, { title: 'Notes', key: 'NOTES', type: 'TEXT'},  { title: 'Actions', key: '', type: 'TEXT' }   ];

  columnsCustomerCharge: IColumnTable[] = 
    [ {title: 'Id', key: 'CHARGID', type: 'TEXT', watch: false,},{ title: 'Category', key: 'CATEGORY', type: 'TEXT', select: true}, 
      { title: 'Amount', key: 'AMOUNT', type: 'NUMBER'}, { title: 'Notes', key: 'NOTES', type: 'TEXT'},  { title: 'Actions', key: '', type: 'TEXT' }   ];



  //ShipmentForm
  addShipmentForm: FormGroup = this.formBuilder.group({
    "SHIPMENTID": [''],
    "TRIPID": [''], //foreign, //real, se obtiene con el TUUID
    "CUSTOMERINVOICE": [''],
    "CUSTOMERINVOICEUUID": [''],
    "CARRIER": ['', Validators.required], //ovs view
    "CUSTOMER": ['', Validators.required], //ovs view
    "CUSTOMERPO": ['', Validators.required], //60 view
    "CITYFROM": [''], //5
    "CITYTO": [''], //5
    "COST": [0], //double
    "COSTCURRENCY": [''], //5
    "AMOUNT": [0], //double
    "AMOUNTCURRENCY": [''], //5
    "PICKUPDATETIME": [new Date()],
    "DELIVERYDATETIME": [new Date()],
    "PIECESUNITCODE": [''], //6
    "WEIGHT": ['', Validators.required], //double - view
    "PIECES": ['', Validators.required], //double - view
    "WEIGHTUNITCODE": ['LB'], //6
    "CUSTOMERNOTIFEMAIL": ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]], //100 - view
    "FUELADVANCE": [false],
    "FUELADVANCEGIVEN": [0], //double
    "FUELCURRENCY": [''], //5
    "SUUID": [''],
    "SECDISPATCHER": [''],
  });


  //DeliveryForm
  addFormDelivery: FormGroup = this.formBuilder.group({
    "TRIPID": [''], //foreign
    "SHIPMENTID": [''], //foreign 
    "DELIVERYDATE": ['', Validators.required], //timestamp
    "DELIVERYETA": ['', Validators.required], //timestamp
    "PIECES": ['', Validators.required], //double
    "PIECESUNITCODE": [''], //6
    "DETAILS": ['', Validators.required], //250
    "WEIGHT": [10, Validators.required], //double
    "WEIGHTUNITCODE": [''], //6
    "SIGNBY": ['', Validators.required], //150
    "LASTPODUPLOADBY": [''], //150
    "LASTPODUPLOADBYTIME": [new Date()],
    "CONSIGNEEID": ['', Validators.required], //ovs 150
    "DROPOFFREF": [''], //100
    "ADRESS": [''], //250
    "ADRESS2": [''], //250
    "CITY": ['', Validators.required], //30
    "STATE": ['', Validators.required], //2
    "ZIPCODE": ['', Validators.required], //6
    "PHONE": [''], //20
    "CONTACT": [''], //180
    "NOTES": [''],
    "COUNTRY": ['', Validators.required], 
    "HOUSENUMBER": ['', Validators.required],
    "STREET": ['', Validators.required],
  });

  //PickUpForm
  addFormPickUp: FormGroup = this.formBuilder.group({
    "TRIPID": [''], 
    "SHIPMENTID": [''], 
    "PICKDATE": ['', Validators.required], 
    "ETAFROM": ['', Validators.required], 
    "ETATO": ['', Validators.required], 
    "PIECES": ['', Validators.required], 
    "PIECESUNITCODE": [''],
    "DETAILS": [''],  
    "WEIGHT": ['', Validators.required], 
    "WEIGHTUNITCODE": [''],
    "COMMODITYID": ['', Validators.required], 
    "PICKUPREF": [''], 
    "SHIPPERID": ['', Validators.required], 
    "NOTES": [''], 
    "ADRESS": [''], 
    "ADRESS2": [''],
    "CITY": ['', Validators.required], 
    "STATE": ['', Validators.required],
    "ZIPCODE": ['', Validators.required],
    "COUNTRY": ['', Validators.required],
    "PHONE": [''],
    "CONTACT": [''], 
    "SEAL": [''], 
    "HOUSENUMBER": ['', Validators.required],
    "STREET": ['', Validators.required],
  });

  //CarrierCostForm
  addFormCarrierCost: FormGroup = this.formBuilder.group({
    "TRIPID": [''], //foreign
    "SHIPMENTID": [''], //foreign
    "CATEGORY": ['', Validators.required], //35
    "AMOUNT": ['', Validators.required], //double
    "AMOUNTCURRENCY": ['0%'], //5
    "NOTES": [''], 
  });

  //CustomerChargesForm
  addFormCustomerCharges: FormGroup = this.formBuilder.group({
    "TRIPID": [''], //foreign
    "SHIPMENTID": [''], //foreign
    "CATEGORY": ['', Validators.required], //35
    "AMOUNT": ['', Validators.required], //double
    "AMOUNTCURRENCY": ['USD'], //5
    "NOTES": [''], 
  });

  
  //select carrier
  @Input() carrierSelect: IItemSelect[] = [];

  carrierCostCatgeory: any[] = [];
  customerChargeCategory: any[] = [];

  categoriesCarCost: string[] = ['Not Selected','Accesorial Expenses', 'Advance',
  'Broker Fee','Carrier Discount','Comdata Service Fee','Comdata Service Fee 2%','Comdata Service Fee 4%', 'Freight Charges', 'Loan','Lumper Fees','Quick Pay Fee'];

  public CarrCostCategory: { CATEGORY: string, DESCRIPTION: string , CARRIERCOST: boolean, CUSTOMERCHARGE: boolean}[];
  public CustChargCategory: { CATEGORY: string, DESCRIPTION: string , CARRIERCOST: boolean, CUSTOMERCHARGE: boolean}[];

  categoriesCustomerCharges: string[] = ['Not Selected','Accesorial Income', 'Freight Charges','Lumper Fees'];

  amountCurrencyCarCost: string[] = ['0%','3%','5%','8%','10%','12%','Trailer 3%'];

  titleModal: string = '';

  //OVS
    //Suggestions
    listSuggestionsM: any = [];
    valueField: string = '';

    //Modal
    columnsSelected: IColumnModal[] = [];
    listMSelected: any = [];
    filterSearchSelected: string = '';
    watchOVS: boolean = false;
  
    fieldOVSSelected: IItemSelectedModal = { id: '',name: '', field: '',  title: '',index: 0,form: null,};
  
    columnsSecundary: IColumnModal[][] = [
      [ { name: '', key: 'ADRESS', style: '', isID: true, isNAME: false }, { name: '', key: 'PHONE', style: '', isID: false, isNAME: false },
      { name: '', key: 'CITY', style: '', isID: false, isNAME: false }, { name: '', key: 'ZIPCODE', style: '', isID: false, isNAME: false },
      { name: '', key: 'STATE', style: '', isID: false, isNAME: false },{ name: '', key: 'COUNTRY', style: '', isID: false, isNAME: false },
      { name: '', key: 'HOUSENUMBER', style: '', isID: false, isNAME: false },{ name: '', key: 'STREET', style: '', isID: false, isNAME: false }  ],
    ];  

    //LAS POSICIONES DEBEN SER IGUALES A LOS DEFINIDOS EN EL HTML DEL COMPONENTE
    fieldsOVS: IItemSelectedModal[] = [
      { id: '', name: '', field: 'CARRIER', title: 'CARRIER', index: 0, form: this.addShipmentForm},
      { id: '', name: '', field: 'CUSTOMER', title: 'CUSTOMER', index: 1, form: this.addShipmentForm},
      { id: '', name: '', field: 'COMMODITYID', title: 'COMMODITY', index: 2, form: this.addFormPickUp},
      { id: '', name: '', field: 'SHIPPERID', title: 'SHIPPER', index: 3, form: this.addFormPickUp,
        secundary: { index: 5,name: 'ADRESS', columns: this.columnsSecundary[0],  } 
      },
      { id: '', name: '', field: 'CONSIGNEEID', title: 'CONSIGNEE', index: 4, form: this.addFormDelivery,
        secundary: { index: 6,  name: 'ADRESS', columns: this.columnsSecundary[0],  }
      },
      { id: '', name: '', field: 'ADRESS', title: 'SHIPPER\'S ADDRESS', index: 5, form: this.addFormPickUp, 
        secundary: {  index: 3,  name: 'SHIPPERID',columns: this.columnsSecundary[0], }
      },
      { id: '', name: '', field: 'ADRESS', title: 'CONSIGNEE\'S ADDRESS', index: 6, form: this.addFormDelivery,
        secundary: {   index: 4, name: 'CONSIGNEEID', columns: this.columnsSecundary[0], }
      },
    ];

  constructor(
    private datePipe: DatePipe, public vs: ValidatorService, private toastEvoke: ToastEvokeService,
    public shipmentService: ShipmentService, private tripService: TripService, private userdetailsService: UserfindetailsService,
    private shipperService: ShipperServiceService, private commodityService: CommodityServiceService,
    private pickupsService: PickupsService, private deliveriesService: DeliveriesService, private carriersCostService: CarrierscostService,
    private customerService: CustomerServiceService, private carrierService: CarrierServiceService,
    private customerChargerService: CustomerChargeService,
    private shipperAddressService: ShipperaddressServiceService, private consigneeAddressService: ConsigneeaddressService,
    private consigneesService: CosigneeServiceService, private formBuilder: FormBuilder, ) { 
    
  }
  ngOnDestroy(): void {
  }

  
  ngOnInit(): void {
    this.getCarrierCostCategory();
    this.getCustomerChargeCategory();
    this.getUsers();
    //definimos la lista de carriers 
    let defaultSelected = true;
    if(this.canEdit){
      if((this.carrierSelect.length == 1 && this.carrierSelect[0].field === 'CARRIER') 
      || (this.carrierSelect.length == 2 && this.carrierSelect[0].field === '' && this.carrierSelect[1].field === 'CARRIER') ){
        
        let carrierEncontrado = this.carrierSelect.findIndex(x => x.field === 'CARRIER');
        this.carrierSelect[carrierEncontrado].selected = true;
        this.addShipmentForm.get("CARRIER").setValue(this.carrierSelect[carrierEncontrado].value);
        defaultSelected = false;
      }
  
      if(!this.carrierSelect.some(x => x.value === '')){
        this.carrierSelect.push({
          value: '',
          text: 'Not Selected',
          field: '',
          selected: defaultSelected
        });
      }
  
      this.carrierSelect.sort( (a,b) => {
        if(a.value > b.value){
          return 1
        }
        if(a.value < b.value){
          return -1
        }
        return 0;
      });
    }


    //creamos el UUID para el shipment
    if(this.shipmentID === null || this.shipmentID.length === 0){
      let generadorUUID = uuidv4();
      this.addShipmentForm.get('SUUID').setValue(generadorUUID);
      this.shipmentUUID = generadorUUID;  
      this.canEditShipment = true;
    }else{      
      //validamos existencia del SHIPMENT
      this.getSHIPMENT();
    }

  }

  getSHIPMENT(){
    let params = { "SHIPMENTID": this.shipmentID }
    this.shipmentService.getBy(params).subscribe(shipment => {
      if(Array.isArray(shipment)){
        if(shipment.length == 1){
          if(shipment[0]['SUUID'] != null && shipment[0]['SUUID'].length > 0){
            this.shipmentUUID = shipment[0]['SUUID'];
          }else{
            let generadorUUID = uuidv4();
            this.shipmentUUID = generadorUUID;  
          }

          let carrierSelected = shipment[0]['CARRIER'];
          if(this.addShipmentForm.get("CARRIER").value != null && this.addShipmentForm.get("CARRIER").value.length > 0){
            carrierSelected = this.addShipmentForm.get("CARRIER").value;
          }
          
          ///load files 
          if(shipment[0]['URLS'] != null && shipment[0]['URLS'] !== ''){
            let valor: string = shipment[0]['URLS'];
            let array_files = valor.split(' ');
            this.addFiles(array_files);
          }



          //console.log(shipment);
          this.addShipmentForm.reset({
            "SHIPMENTID": shipment[0]['SHIPMENTID'],
            "TRIPID": shipment[0]['TRIPID'], 
            "CUSTOMERINVOICE": shipment[0]['CUSTOMERINVOICE'],
            "CUSTOMERINVOICEUUID": shipment[0]['CUSTOMERINVOICEUUID'],
            "CARRIER": carrierSelected, 
            "CUSTOMER": shipment[0]['CUSTOMER'],
            "CUSTOMERPO": shipment[0]['CUSTOMERPO'], 
            "CITYFROM": shipment[0]['CITYFROM'], 
            "CITYTO": shipment[0]['CITYTO'],
            "COST": shipment[0]['COST'],
            "COSTCURRENCY": shipment[0]['COSTCURRENCY'], 
            "AMOUNT": shipment[0]['AMOUNT'], 
            "AMOUNTCURRENCY": shipment[0]['AMOUNTCURRENCY'], 
            "PICKUPDATETIME": shipment[0]['PICKUPDATETIME'],
            "DELIVERYDATETIME": shipment[0]['DELIVERYDATETIME'],
            "PIECESUNITCODE": shipment[0]['PIECESUNITCODE'], 
            "WEIGHT": shipment[0]['WEIGHT'], 
            "PIECES": shipment[0]['PIECES'], 
            "WEIGHTUNITCODE": shipment[0]['WEIGHTUNITCODE'], 
            "CUSTOMERNOTIFEMAIL": shipment[0]['CUSTOMERNOTIFEMAIL'], 
            "FUELADVANCE": shipment[0]['FUELADVANCE'],
            "FUELADVANCEGIVEN": shipment[0]['FUELADVANCEGIVEN'], 
            "FUELCURRENCY": shipment[0]['FUELCURRENCY'], 
            "SUUID": this.shipmentUUID,
            "SECDISPATCHER": shipment[0]['SECDISPATCHER'] != null ? shipment[0]['SECDISPATCHER'] : '',
          });

          if(shipment[0]['CUSTOMERINVOICE'] != null && shipment[0]['CUSTOMERINVOICE'].length > 0){
            this.canEditShipment = false;
          }
  

          let ovsEncontrados: any[] =  [ { ID: 'CUSTOMER', NAME: 'NAMECS' }];
          ovsEncontrados.forEach( ovs => {
            let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID']);
            if(ovsSelected != null){
               ovsSelected.id = shipment[0][ovs['ID']];
               ovsSelected.name = shipment[0][ovs['NAME']];
            }
          });
          
  
  
          this.loadTable("PICK UP");
          this.loadTable("DELIVERY");
          this.loadTable("CARRIER COST");
          this.loadTable("CUSTOMER CHARGES");
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'No Found',
            showConfirmButton: false,
            timer: 1300,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              this.toastEvoke.warning(`ERROR SHIPMENT 0`, 'Shipment Not Found, contact your admin, please.').subscribe();
              this.closeAddShipment.emit(false);
            }
            return;
          });
        }
      }else{
        this.toastEvoke.danger(`ERROR ${shipment.code}`, shipment.message).subscribe();
      }
    });
  }

  getUsers(){
    let params = { COMPANY: this.formTrip.get('COMPANY')?.value }
    this.userdetailsService.getBy(params).subscribe(data => {
      //console.log(data);
      if(Array.isArray(data)){
        this.listUsers = data;
      }
    });
  }

  getCarrierCostCategory(){
    this.carrierCostCatgeory = [];
    this.carriersCostService.getCategories().subscribe(categories => {
      if(categories != null && Array.isArray(categories) && categories.length > 0){
        this.carrierCostCatgeory = categories.map( (categorie) => ({ DESCRIPTION: categorie['DESCRIPTION'], CATEGORY: categorie['CATEGORY']  })  );
      }
    }); 
  }

  getCustomerChargeCategory(){
    this.customerChargeCategory = [];
    this.customerChargerService.getCategories().subscribe(categories => {
      if(categories != null && Array.isArray(categories) && categories.length > 0){
        this.customerChargeCategory = categories.map( (categorie) => ({ DESCRIPTION: categorie['DESCRIPTION'], CATEGORY: categorie['CATEGORY']  })  );
      }
    });
  }

  getCategoryByCodeCarrierCost(code: string){
    let category = '';
    let encontrado = this.carrierCostCatgeory.find(x => x['CATEGORY'] === code);
    if(encontrado != null){
      category = encontrado['DESCRIPTION'];
    }
    return category;
  }

  getCategoryByCodeCustomerCharge(code: string){
    let category = '';
    let encontrado = this.customerChargeCategory.find(x => x['CATEGORY'] === code);
    if(encontrado != null){
      category = encontrado['DESCRIPTION'];
    }
    return category;
  }

  
  getCarrierByCode(code: string){
    let carrier = this.carrierSelect.find(x => x.value == code);
    if(carrier != null){
      return carrier.text;
    }
    return '';
  }


  existTRIP(search: boolean = false, operacion: string){
    //
    if(this.tripUUID != null){
      if(this.tripID == null || this.tripID.length == 0){
        let params = { "TUUID": this.tripUUID }
        this.tripService.getBy(params).subscribe(data => {
          if(Array.isArray(data)){
            if(data.length == 1){
              this.tripID = data[0].TRIPID.toString();
              this.actionGetTripID.emit(this.tripID);
  
              switch(operacion){
                case 'CREATE SHIPMENT': case 'CREATE CARRIER COST': case 'CREATE DELIVERY': case 'CREATE PICK UP': 
                case 'CREATE CUSTOMER CHARGES': this.existSHIPMENT(false,operacion); break;
              }

            }else if(data.length == 0 && !search){
              this.tripService.CreateObj(this.formTrip.value).subscribe(result => {
                if(result.success){
                  this.existTRIP(true, operacion);
                }else{
                  this.toastEvoke.danger(`ERROR TRIP ${result.code}`, result.message).subscribe();
                }
              });
            }
          }else{
            this.toastEvoke.danger(`ERROR TRIP ${data.code}`, data.message).subscribe();
          }
        });
      }
    }else{
      this.toastEvoke.warning(`ERROR TRIP 0`, "UUUID NO FOUND, contact your admin, please.").subscribe();
    }
  }

  existSHIPMENT(search: boolean = false, operacion: string, secundary: string = '',indexLoading: number = 0){
    if(this.shipmentUUID != null){
      if(this.shipmentID == null || this.shipmentID == ''){
        let params = { "SUUID": this.shipmentUUID }
        this.shipmentService.getBy(params).subscribe(data => {
          if(Array.isArray(data)){
            if(data.length == 1){
              this.shipmentID = data[0]['SHIPMENTID'];

              switch(operacion){
                case 'CREATE SHIPMENT': 
                this.toastEvoke.success(`Success`, 'Your work has been saved').subscribe();
                this.addShipmentForm.setControl('SHIPMENTID', new FormControl(this.shipmentID));
                
                if(secundary.length > 0){
                  this.showModal(secundary);
                }
                break;
                case 'EDIT SHIPMENT': case 'EDIT PICK UP': case 'EDIT DELIVERY': case 'EDIT CARRIER COST': case 'EDIT CUSTOMER CHARGES': 
                case 'CREATE CARRIER COST': case 'CREATE DELIVERY': case 'CREATE PICK UP': case 'CREATE CUSTOMER CHARGES':
                  this.existSHIPMENT(true, operacion);
                break;
              }
            }else if(data.length == 0 && !search){
             //lo creamos
              this.addShipmentForm.get("TRIPID").setValue(this.tripID);

              if(this.addShipmentForm.get("SECDISPATCHER")?.value.length === 'null' || this.addShipmentForm.get("SECDISPATCHER")?.value === null){
                this.addShipmentForm.get("SECDISPATCHER")?.setValue("");
              }

              this.shipmentService.CreateObj(this.addShipmentForm.value).subscribe(resultShipment => {
                
                if(secundary.length > 0){
                  this.isLoading[indexLoading] = false;
                }else{
                  this.isLoading[indexLoading] = false;
                }
                this.vs.finalizar('protector');

                if(resultShipment.success){
                  this.existSHIPMENT(true, operacion, secundary);
                }else{
                  if(operacion === 'CREATE SHIPMENT'){
                    //error message;
                    this.toastEvoke.danger(`ERROR ${resultShipment.code}`, resultShipment.message).subscribe();
                  }
                }
              });
            }
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        });
      }else{
        switch(operacion){
          case "EDIT SHIPMENT":
            if(this.addShipmentForm.get("SECDISPATCHER")?.value === 'null' || this.addShipmentForm.get("SECDISPATCHER")?.value === null){
              this.addShipmentForm.get("SECDISPATCHER")?.setValue("");
            }
            
            this.shipmentService.EditObj(this.addShipmentForm.value).subscribe(result => {
              this.isLoading[indexLoading] = false;
              this.vs.finalizar('protector');
              if(result.success){
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1300
                }).then(result => {
                  // if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
                  //   this.closeShipment();
                  // }
                });
              }else{
                this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
              }
            });
            break;
          case 'EDIT PICK UP':
            this.pickupsService.EditObj(this.addFormPickUp.value).subscribe(resultPickup => {
              if(resultPickup.success){
                this.loadTable('PICK UP');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  timer: 1300
                });
                this.pickUpModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultPickup.code}`, resultPickup.message).subscribe();
              }
            });
          break;
          case 'EDIT DELIVERY':
            this.deliveriesService.EditObj(this.addFormDelivery.value).subscribe(resultDelivery => {
              if(resultDelivery.success){
                this.loadTable('DELIVERY');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  timer: 1300
                });
                this.deliveryModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultDelivery.code}`, resultDelivery.message).subscribe();
              }
            });
          break;
          case 'EDIT CARRIER COST':
            this.carriersCostService.EditObj(this.addFormCarrierCost.value).subscribe(resultcost => {
              if(resultcost.success){
                this.loadTable('CARRIER COST');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  timer: 1300
                });
                this.carrierModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultcost.code}`, resultcost.message).subscribe();
              }
            });
          break;
          case 'EDIT CUSTOMER CHARGES':
            this.customerChargerService.EditObj(this.addFormCustomerCharges.value).subscribe(resultCharges => {
              if(resultCharges.success){
                this.loadTable('CUSTOMER CHARGES');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  timer: 1300
                });
                this.customerChargesModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultCharges.code}`, resultCharges.message).subscribe();
              }
            });
          break;
          case "CREATE CARRIER COST":
            let percentaje = this.addFormCarrierCost.get('AMOUNTCURRENCY').value;
            let amountPrincipal = this.addFormCarrierCost.get('AMOUNT').value;

            let categorySelected = this.getCategoryByCodeCarrierCost(this.addFormCarrierCost.get('CATEGORY').value).trim().toLowerCase();
            let search: string = 'freight charges';
            let encontroCoincidencia = categorySelected != '' && categorySelected === search;
            let esMayoraCero = false;
            let amountSecundario = 0;

            let categoryBrokerFee = this.carrierCostCatgeory != null ? this.carrierCostCatgeory.find(x => x['DESCRIPTION'].trim().toLowerCase()  === 'broker fee').CATEGORY : null;
            //validar trailer 3%
            let numero = percentaje.match(/(\d+)/);
            if(numero && numero[0] != null && parseInt(numero) > 0){
              amountSecundario = (parseInt(numero[0]) * parseInt(amountPrincipal)) / 100;
              esMayoraCero = true;
            }
            this.addFormCarrierCost.get('AMOUNTCURRENCY').setValue("USD");
            this.addFormCarrierCost.get("TRIPID").setValue(this.tripID);
            this.addFormCarrierCost.get("SHIPMENTID").setValue(this.shipmentID);
            this.carriersCostService.CreateObj(this.addFormCarrierCost.value).subscribe(resultCost => {
              if(resultCost.success){
                if(encontroCoincidencia && esMayoraCero && categoryBrokerFee != null && categoryBrokerFee != ''){

                  let formBrokeFree = this.formBuilder.group({
                    "TRIPID": this.tripID, 
                    "SHIPMENTID": this.shipmentID, 
                    "CATEGORY": categoryBrokerFee, 
                    "AMOUNT": amountSecundario,
                    "AMOUNTCURRENCY": 'USD', //5
                    "NOTES": [''], 
                  });

                  this.carriersCostService.CreateObj(formBrokeFree.value).subscribe(data =>{
                    this.loadTable('CARRIER COST');
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Your work has been saved',
                      showConfirmButton: false,
                      timer: 1300
                    });
                    this.carrierModal.nativeElement.close();
                  });
                }else{
                  if(encontroCoincidencia && esMayoraCero){
                    this.toastEvoke.warning(`ERROR CARRIER COST 0`, `Category Broker Fee No Found`).subscribe();
                  }
                  this.loadTable('CARRIER COST');
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1300
                  });
                  this.carrierModal.nativeElement.close();
                }
              }else{
                this.toastEvoke.danger(`ERROR ${resultCost.code}`, resultCost.message).subscribe();
              }
            });

            break;
          case "CREATE DELIVERY":
            this.addFormDelivery.get("TRIPID").setValue(this.tripID);
            this.addFormDelivery.get("SHIPMENTID").setValue(this.shipmentID);
            this.deliveriesService.CreateObj(this.addFormDelivery.value).subscribe(resultDelivery => {
              if(resultDelivery.success){
                this.loadTable('DELIVERY');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1300
                });
                this.deliveryModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultDelivery.code}`, resultDelivery.message).subscribe();
              }
            });
            break;
          case "CREATE PICK UP":
            this.addFormPickUp.get("TRIPID").setValue(this.tripID);
            this.addFormPickUp.get("SHIPMENTID").setValue(this.shipmentID);
            this.pickupsService.CreateObj(this.addFormPickUp.value).subscribe(resultPickup => {
              if(resultPickup.success){
                this.loadTable('PICK UP');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1300
                });
                this.pickUpModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultPickup.code}`, resultPickup.message).subscribe();
              }
            });
            break;
          case "CREATE CUSTOMER CHARGES":
            this.addFormCustomerCharges.get("TRIPID").setValue(this.tripID);
            this.addFormCustomerCharges.get("SHIPMENTID").setValue(this.shipmentID);
            this.customerChargerService.CreateObj(this.addFormCustomerCharges.value).subscribe(resultCharges => {
              if(resultCharges.success){
                this.loadTable('CUSTOMER CHARGES');
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1300
                });
                this.customerChargesModal.nativeElement.close();
              }else{
                this.toastEvoke.danger(`ERROR ${resultCharges.code}`, resultCharges.message).subscribe();
              }
            });
            break;
        }
      }
    }else{
      this.toastEvoke.warning(`ERROR SHIPMENT 0`, "UUUID NO FOUND, contact your admin, please.").subscribe();
    }
  }
  
  confirmDelete(type: string, id: string){
    switch(type){
      case 'PICK UP': this.confirmDeleteAction(this.pickupsService, type, 'PICKUPID', id); break;
      case 'DELIVERY': this.confirmDeleteAction(this.deliveriesService, type, 'DELIVERYID', id); break;
      case 'CARRIER COST': this.confirmDeleteAction(this.carriersCostService, type, 'CARCOSTID', id); break;
      case 'CUSTOMER CHARGES': this.confirmDeleteAction(this.customerChargerService, type, 'CHARGID', id); break;
      default: break;
    }
  }

  confirmDeleteAction(service: any, type: string, field: string,  id: string){
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
        let params = {};
        params[field] = id;
        service.deleteBy(params).subscribe(result => {
          if(result.success){
            // Swal.fire({
            //   title: 'Deleted!',
            //   text: 'Your work has been deleted.',
            //   icon: 'success',
            //   showConfirmButton: false,
            //   timer: 1300,
            // });
            this.loadTable(type);
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }
    })
  }


  closeShipment(){
    this.closeAddShipment.emit(false);
  }

  showModal(type: string, id: string = '', indexLoading: number = 0): void {
    
    if(this.shipmentID == null || this.shipmentID.length == 0){
        this.vs.inicializar('protector');
        this.isLoading[indexLoading] = true;
        this.existSHIPMENT(false, "CREATE SHIPMENT", type, indexLoading);
      return;
    }
    
    let params = {};
    switch(type){
      case 'PICK UP': 
        this.fieldsOVS.forEach( item=> {
          if(item.index === 2 || item.index === 3 || item.index === 5){
            item.id = '';
            item.name = '';
          }
        });

        if(id != ''){
          this.titleModal = 'EDIT PICK UP';
          params = { 'PICKUPID' : id};
          this.pickupsService.getBy(params).subscribe(dataPickup => {
            //console.log(data);
            if(Array.isArray(dataPickup)){
              if(dataPickup.length == 1){
                this.addFormPickUp.reset({
                  "TRIPID": dataPickup[0]['TRIPID'], 
                  "SHIPMENTID": dataPickup[0]['SHIPMENTID'], 
                  "PICKDATE": this.datePipe.transform(dataPickup[0]['PICKDATE'],'yyyy-MM-dd HH:mm'), 
                  "ETAFROM": this.datePipe.transform(dataPickup[0]['ETAFROM'],'yyyy-MM-dd'), 
                  "ETATO": this.datePipe.transform(dataPickup[0]['ETATO'],'yyyy-MM-dd'),
                  "PIECES": dataPickup[0]['PIECES'], 
                  "DETAILS": dataPickup[0]['DETAILS'],  
                  "WEIGHT": dataPickup[0]['WEIGHT'], 
                  "COMMODITYID": dataPickup[0]['COMMODITYID'], 
                  "PICKUPREF": dataPickup[0]['PICKUPREF'], 
                  "SHIPPERID": dataPickup[0]['SHIPPERID'], 
                  "NOTES": dataPickup[0]['NOTES'], 
                  "ADRESS": dataPickup[0]['ADRESS'], 
                  "ADRESS2": dataPickup[0]['ADRESS2'], 
                  "CITY": dataPickup[0]['CITY'], 
                  "ZIPCODE": dataPickup[0]['ZIPCODE'], 
                  "PHONE": dataPickup[0]['PHONE'], 
                  "CONTACT": dataPickup[0]['CONTACT'],
                  "SEAL": dataPickup[0]['SEAL'], 
                  "PIECESUNITCODE": dataPickup[0]['PIECESUNITCODE'],
                  "WEIGHTUNITCODE": dataPickup[0]['WEIGHTUNITCODE'],
                  "STATE": dataPickup[0]['STATE'],
                  "COUNTRY": dataPickup[0]['COUNTRY'],
                });
  
                this.addFormPickUp.setControl('PICKUPID', new FormControl(dataPickup[0]['PICKUPID']));
                
                let complements: string[] = ["COMMODITYID", "SHIPPERID", "ADRESS"];
                complements.forEach(complement => {
                  let fieldOVS = this.fieldsOVS.find(x => (x.field === complement && x.secundary == null) || (x.field === complement && complements.some(y => y == x.secundary.name)  ) );
                  switch(complement){
                    case 'COMMODITYID':
                      if(fieldOVS != null){
                        fieldOVS.id = dataPickup[0][complement];
                        fieldOVS.name = dataPickup[0]['DESCRIPTIONCOMM'] != null ? dataPickup[0]['DESCRIPTIONCOMM'] : 'No Found';
                      }
                     
                      break;
                    case 'SHIPPERID':
                      if(fieldOVS != null){
                        fieldOVS.id = dataPickup[0][complement];
                        fieldOVS.name = dataPickup[0]['NAMESHIP'] != null ? dataPickup[0]['NAMESHIP'] : 'No Found';
                      }
                      break;
                    case 'ADRESS':
                      if(fieldOVS != null){
                        fieldOVS.id = '';
                        fieldOVS.name = dataPickup[0]['ADRESS'];
                        this.addFormPickUp.get(complement).setValue(dataPickup[0][complement]);
                      }
                      break;
                  }
                });
                this.pickUpModal.nativeElement.show(); 
              }else{
                this.toastEvoke.danger(`ERROR PICKUP`, 'Pickup No Found, Contact your admin, please').subscribe();
                this.pickUpModal.nativeElement.close();
              }
            }else{
              this.toastEvoke.danger(`ERROR ${dataPickup.code}`, dataPickup.message).subscribe();
            }
          });
        }else{
          this.titleModal = 'CREATE PICK UP';
          this.addFormPickUp.reset({
            "TRIPID": "", 
            "SHIPMENTID": "", 
            "PICKDATE": "", 
            "ETAFROM": "", 
            "ETATO": "", 
            "PIECES": "", 
            "DETAILS": "",  
            "WEIGHT": "", 
            "COMMODITYID": "", 
            "PICKUPREF": "", 
            "SHIPPERID": "", 
            "NOTES": "", 
            "ADRESS": "", 
            "ADRESS2": '', 
            "CITY": '', 
            "ZIPCODE": '', 
            "PHONE": '', 
            "CONTACT": '',
            "SEAL": '', 
            "PIECESUNITCODE": '',
            "WEIGHTUNITCODE": '',
            "STATE": '',
            "COUNTRY": '',
          });
          this.addFormPickUp.removeControl('PICKUPID');
          this.pickUpModal.nativeElement.show(); 
        }
      break;
      case 'DELIVERY': 
      this.fieldsOVS.forEach( item=> {
        if(item.index === 4 || item.index === 6){
          item.id = '';
          item.name = '';
        }
        
      });
      if(id !== ''){
        this.titleModal = 'EDIT DELIVERY';
        params = { 'DELIVERYID' : id};
        this.deliveriesService.getBy(params).subscribe(dataDelivery => {
          if(Array.isArray(dataDelivery)){
            if(dataDelivery.length == 1){
              this.addFormDelivery.reset({
                "TRIPID": dataDelivery[0]['TRIPID'], 
                "SHIPMENTID": dataDelivery[0]['SHIPMENTID'],  
                "DELIVERYDATE": this.datePipe.transform(dataDelivery[0]['DELIVERYDATE'],'yyyy-MM-dd HH:mm'),
                "DELIVERYETA": this.datePipe.transform(dataDelivery[0]['DELIVERYETA'],'yyyy-MM-dd'), 
                "PIECES": dataDelivery[0]['PIECES'],
                "PIECESUNITCODE": dataDelivery[0]['PIECESUNITCODE'],
                "DETAILS": dataDelivery[0]['DETAILS'],
                "WEIGHT": 10, 
                "WEIGHTUNITCODE": dataDelivery[0]['WEIGHTUNITCODE'], 
                "SIGNBY": dataDelivery[0]['SIGNBY'], 
                "LASTPODUPLOADBY": '',
                "LASTPODUPLOADBYTIME": new Date(dataDelivery[0]['LASTPODUPLOADBYTIME']),
                "CONSIGNEEID": dataDelivery[0]['CONSIGNEEID'], 
                "DROPOFFREF": dataDelivery[0]['DROPOFFREF'],
                "ADRESS": dataDelivery[0]['ADRESS'], 
                "ADRESS2": dataDelivery[0]['ADRESS2'], 
                "CITY": dataDelivery[0]['CITY'], 
                "STATE": dataDelivery[0]['STATE'], 
                "ZIPCODE": dataDelivery[0]['ZIPCODE'],
                "PHONE": dataDelivery[0]['PHONE'], 
                "CONTACT": dataDelivery[0]['CONTACT'], 
                "NOTES": dataDelivery[0]['NOTES'], 
                "COUNTRY": dataDelivery[0]['COUNTRY'],
              });
  
              this.addFormDelivery.setControl('DELIVERYID', new FormControl(dataDelivery[0]['DELIVERYID']));
  
              let complements: string[] = ["CONSIGNEEID", "ADRESS"];
              complements.forEach(complement => {
                let fieldOVS = this.fieldsOVS.find(x => (x.field === complement && x.secundary == null) || (x.field === complement && complements.some(y => y == x.secundary.name)  ) );
                switch(complement){
                  case 'CONSIGNEEID':
                    if(fieldOVS != null){
                      fieldOVS.id = dataDelivery[0][complement];
                      fieldOVS.name = dataDelivery[0]['NAMECONS'] != null ? dataDelivery[0]['NAMECONS'] : 'No Found';
                    }
                    break;
                  case 'ADRESS':
                    if(fieldOVS != null){
                      fieldOVS.id = '';
                      fieldOVS.name = dataDelivery[0]['ADRESS'];
                      this.addFormDelivery.get(complement).setValue(dataDelivery[0][complement]);
                    }
                    break;
                }
              });
                this.deliveryModal.nativeElement.show(); 
              }else{
                this.toastEvoke.danger(`ERROR DELIVERY`, 'Delivery No Found, Contact your admin, please').subscribe();
                this.deliveryModal.nativeElement.close();
              }
            }else{
              this.toastEvoke.danger(`ERROR ${dataDelivery.code}`, dataDelivery.message).subscribe();
            }
        });
      }else{
        this.titleModal = 'CREATE DELIVERY';
        this.addFormDelivery.reset({
          "TRIPID": '', 
          "SHIPMENTID": '',  
          "DELIVERYDATE": '',
          "DELIVERYETA": '', 
          "PIECES": '',
          "PIECESUNITCODE": '',
          "DETAILS": '',
          "WEIGHT": 10, 
          "WEIGHTUNITCODE": '', 
          "SIGNBY": '', 
          "LASTPODUPLOADBY": '',
          "LASTPODUPLOADBYTIME": new Date(),
          "CONSIGNEEID": '', 
          "DROPOFFREF": '',
          "ADRESS": '', 
          "ADRESS2": '', 
          "CITY": '', 
          "STATE": '', 
          "ZIPCODE": '',
          "PHONE": '', 
          "CONTACT": '', 
          "NOTES": '' 
        });

        this.addFormDelivery.removeControl('DELIVERYID');

        this.deliveryModal.nativeElement.show(); 
      }
      break;

      case 'CARRIER COST': 
      if(id !== ''){
        this.titleModal = 'EDIT CARRIER COST';
        params = { 'CARCOSTID' : id};
        this.carriersCostService.getBy(params).subscribe(resultCost => {
          if(Array.isArray(resultCost)){
            if(resultCost.length == 1){
              this.addFormCarrierCost.reset({
                "TRIPID": resultCost[0]['TRIPID'], 
                "SHIPMENTID": resultCost[0]['SHIPMENTID'],
                "CATEGORY": resultCost[0]['CATEGORY'],
                "AMOUNT": resultCost[0]['AMOUNT'], 
                "AMOUNTCURRENCY": "USD", 
                "NOTES": resultCost[0]['NOTES'], 
              });
              this.addFormCarrierCost.setControl('CARCOSTID', new FormControl(resultCost[0]['CARCOSTID']));
              this.carrierModal.nativeElement.show(); 
            }else{
              this.toastEvoke.danger(`ERROR CARRIER COST`, 'Carrier Cost No Found, Contact your admin, please').subscribe();
              this.carrierModal.nativeElement.close();
            }
          }else{
            this.toastEvoke.danger(`ERROR ${resultCost.code}`, resultCost.message).subscribe();
          }
        });
      }else{
        this.titleModal = 'CREATE CARRIER COST';
        this.addFormCarrierCost.reset({
          "TRIPID": '', 
          "SHIPMENTID": '', 
          "CATEGORY": '', 
          "AMOUNT": '', 
          "AMOUNTCURRENCY": '0%', 
          "NOTES": '', 
        });
        this.addFormCarrierCost.removeControl('CARCOSTID');

        this.carrierModal.nativeElement.show(); 
      }
        
        break;
      case 'CUSTOMER CHARGES': 
      if(id !== ''){
        this.titleModal = 'EDIT CUSTOMER CHARGES';
        params = { 'CHARGID' : id}  
        this.customerChargerService.getBy(params).subscribe(resultCharges => {
          if(Array.isArray(resultCharges)){
            if(resultCharges.length == 1){
              this.addFormCustomerCharges.reset({
                "TRIPID": resultCharges[0]['TRIPID'],
                "SHIPMENTID": resultCharges[0]['SHIPMENTID'],
                "CATEGORY": resultCharges[0]['CATEGORY'],
                "AMOUNT": resultCharges[0]['AMOUNT'],
                "AMOUNTCURRENCY": resultCharges[0]['AMOUNTCURRENCY'], 
                "NOTES": resultCharges[0]['NOTES'], 
                });
  
                this.addFormCustomerCharges.setControl('CHARGID', new FormControl(resultCharges[0]['CHARGID']));
                this.customerChargesModal.nativeElement.show(); 
              }else{
                this.toastEvoke.danger(`ERROR CHARGES CUSTOMER`, 'Charges Customer No Found, Contact your admin, please').subscribe();
                this.customerChargesModal.nativeElement.close();
              }
            }else{
              this.toastEvoke.danger(`ERROR ${resultCharges.code}`, resultCharges.message).subscribe();
            }
        });
      }else{
        this.titleModal = 'CREATE CUSTOMER CHARGES';
        this.addFormCustomerCharges.reset({
          "TRIPID": '', 
          "SHIPMENTID": '', 
          "CATEGORY": '',
          "AMOUNT": '', 
          "AMOUNTCURRENCY": 'USD', 
          "NOTES": '', 
          });
          this.addFormCustomerCharges.removeControl('CHARGID');
          this.customerChargesModal.nativeElement.show(); 
        }
        break;
    }
  }

  closeModal(type: string){
    switch(type){
      case 'PICK UP': this.pickUpModal.nativeElement.close(); break;
      case 'DELIVERY': this.deliveryModal.nativeElement.close(); break;
      case 'CARRIER COST': this.carrierModal.nativeElement.close(); break;
      case 'CUSTOMER CHARGES': this.customerChargesModal.nativeElement.close(); break;
    }
  }

  validarcampos(campo: string, form: FormGroup) {
    return form.controls[campo].errors && form.controls[campo].touched;
  }

  getMessageError(campo: string, form: FormGroup, text: string){
    let message = '';
    if(form.get(campo)?.errors?.['required'] && form.get(campo)?.touched ){
      message = `Please set a ${text}`;
    }else if(form.get(campo)?.errors?.['pattern'] && form.get(campo)?.touched){
      message = `Incorrect Format`;
    }
    return message;
  }

  isFreightCharges() {
    let categorieSelected = this.getCategoryByCodeCarrierCost(this.addFormCarrierCost.get('CATEGORY')?.value);
    let search: string = 'freight charges';
    if(categorieSelected != null && categorieSelected.trim().toLowerCase() === search  
      && (this.addFormCarrierCost.get('CARCOSTID') == null || this.addFormCarrierCost.get('CARCOSTID').value == '' 
        || this.addFormCarrierCost.get('CARCOSTID').value == null) )
      {
        this.addFormCarrierCost.get('AMMOUNTCURRENCY')?.setValue('0%');
        return true;
      }
    this.addFormCarrierCost.get('AMMOUNTCURRENCY')?.setValue('');
    return false;
  }

  saveShipment(){

    if(this.shipmentID != null && this.shipmentID != ''){
      this.isLoading[0] = true;
      this.vs.inicializar('protector');

      this.existSHIPMENT(true, `EDIT SHIPMENT`);
    }else{
      if(this.tripID != null && this.tripID.length > 0){
        this.isLoading[0] = true;
        this.vs.inicializar('protector');

        this.existSHIPMENT(false, `CREATE SHIPMENT`);
      }else{
        this.existTRIP(false, `CREATE SHIPMENT`);
      }
    }
  }

  saveFormModal(action: string){
    let actionSecundario = '';
    switch(action){
      case 'PICK UP':
        if(this.addFormPickUp.get('PICKUPID') != null && this.addFormPickUp.get('PICKUPID').value != null){
          actionSecundario = 'EDIT PICK UP';
        }else{
          actionSecundario = 'CREATE PICK UP';
        }
      break;
      case 'CARRIER COST':
        if(this.addFormCarrierCost.get('CARCOSTID') != null && this.addFormCarrierCost.get('CARCOSTID').value != null){
          actionSecundario = 'EDIT CARRIER COST';
        }else{
          actionSecundario = 'CREATE CARRIER COST';
        }
      break;
      case 'CUSTOMER CHARGES':
        if(this.addFormCustomerCharges.get('CHARGID') != null && this.addFormCustomerCharges.get('CHARGID').value != null ){
          actionSecundario = 'EDIT CUSTOMER CHARGES';
        }else{
          actionSecundario = 'CREATE CUSTOMER CHARGES';
        }
      break;
      case 'DELIVERY':
        if(this.addFormDelivery.get('DELIVERYID') != null && this.addFormDelivery.get('DELIVERYID').value != null){
          actionSecundario = 'EDIT DELIVERY';
        }else{
          actionSecundario = 'CREATE DELIVERY';
        }
      break;
    }

    switch(actionSecundario){
      case 'CREATE PICK UP':case 'CREATE CARRIER COST': case 'CREATE DELIVERY': case 'CREATE CUSTOMER CHARGES':
       if(this.tripID != null && this.tripID.length > 0){
          this.existSHIPMENT(false, actionSecundario);
        }else{
          this.existTRIP(false, actionSecundario);
        }
      break;
      case 'EDIT PICK UP': case 'EDIT CARRIER COST': case 'EDIT DELIVERY': case 'EDIT CUSTOMER CHARGES':
        this.existSHIPMENT(true, actionSecundario);
      break;
      default: //error
      break;
    }

  }

  loadTable(type: string){
    //buscar por shipment
    let modeloPrincipal = {};
    switch(type){
      case 'PICK UP': 
      modeloPrincipal = { "TRIPID": this.tripID, "SHIPMENTID": this.shipmentID }
      this.pickupsService.getBy(modeloPrincipal).subscribe(dataPickup => {
        if(Array.isArray(dataPickup)){
          if(dataPickup.length > 0){
            let list: any = [];
            dataPickup.forEach( (item: any) => {
              let modelo: any = {};
              this.columnsPickUps.forEach(column => {
                if(column.key != null && column.key.length > 0){
                  if(item[column.key] != null ){
                    if(column.key === 'SHIPPERID'){
                      modelo[column.key] = item['NAMESHIP'] != null ? item['NAMESHIP'] : 'No Found';
                    }else if(column.key === 'PIECES'){
                      modelo[column.key] = item[column.key] + " / " + item['WEIGHT'];
                    }else{
                      modelo[column.key] = item[column.key];
                    }
                  }else{
                    modelo[column.key] = "";
                  }
  
                }
              });
              list.push(modelo);
            });
            this.listPickUps = list.sort( (a,b)=> { return a['PICKUPID']-b['PICKUPID']; } );
          }else{
            this.listPickUps = [];
          }
        }else{
          this.toastEvoke.warning(`ERROR ${dataPickup.code}`, dataPickup.message).subscribe();
        }
      });
      break;
      case 'DELIVERY':
        modeloPrincipal = { "TRIPID": this.tripID, "SHIPMENTID": this.shipmentID }
      this.deliveriesService.getBy(modeloPrincipal).subscribe(data => {
        if(Array.isArray(data)){
          if(data.length > 0){
            let list: any = [];
            data.forEach( (item: any) => {
              let modelo: any = {};
              this.columnsDeliverys.forEach( async column => {
                if(column.key != null && column.key.length > 0) {
                  if(item[column.key] != null ) {
                    if(column.key === 'CONSIGNEEID'){
                      modelo[column.key] = item['NAMECONS'] != null ? item['NAMECONS'] : 'No Found';
                    }else if(column.key === 'PIECES'){
                      modelo[column.key] = item[column.key] + " / " + item['WEIGHT'];
                    
                    }else if(column.key === 'LASTPODUPLOADBY'){
                      if(item['URLS'] != null && item['URLS'] !== ''){
                        let attachments: string = item['URLS'];
                        let array_files = attachments.split(' ');
                        if(array_files.length > 0){
                          let lastFile = array_files[array_files.length - 1];
                          modelo[column.key] = lastFile;
                        }
                      }else{
                        modelo[column.key] = "";
                      }
                    }else if(column.key === 'UPLOADATTACHMENT'){
                      modelo[column.key] = false;
                    }
                    else{
                      modelo[column.key] = item[column.key];
                    }
                  }else{
                    modelo[column.key] = "";
                  }
                }
              });
              list.push(modelo);
            });
            this.listDeliverys =  list.sort( (a,b)=> { return a['DELIVERYID']-b['DELIVERYID']; } );;
          }else{
            this.listDeliverys = [];
          }
        }else{
          this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
        }
      });
      break;
      case 'CARRIER COST':
        modeloPrincipal = { "TRIPID": this.tripID, "SHIPMENTID": this.shipmentID }
        this.carriersCostService.getBy(modeloPrincipal).subscribe(data => {
          if(Array.isArray(data)){
            if(data.length > 0){
              let list: any = [];
              data.forEach( (item: any) => {
                let modelo: any = {};
                
                this.columnsCarriers.forEach(column => {
                  if(column.key != null){
                    if(column.key === 'CATEGORY'){
                      let categoryName = this.getCategoryByCodeCarrierCost(item[column.key]);
                      modelo[column.key] = categoryName;
                    }else{
                      if(item[column.key] != null){
                        modelo[column.key] = item[column.key];
                      }else{
                        modelo[column.key] = "";
                      }
                    }
                  }
                });
                list.push(modelo);
              });
      
              this.listCarriers = list;
            }else{
              this.listCarriers = [];
            }
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        });
      break;
      case 'CUSTOMER CHARGES':
        modeloPrincipal = { "TRIPID": this.tripID, "SHIPMENTID": this.shipmentID }
        this.customerChargerService.getBy(modeloPrincipal).subscribe(data => {
          if(Array.isArray(data)){
            if(data.length > 0){
              let list: any = [];
              data.forEach( (item: any) => {
                let modelo: any = {};
                
                this.columnsCustomerCharge.forEach(column => {
                  if(column.key != null){
                    if(column.key === 'CATEGORY'){
                      let categoryName = this.getCategoryByCodeCustomerCharge(item[column.key]);
                      modelo[column.key] = categoryName;
                    }else{
                      if(item[column.key] != null){
                        modelo[column.key] = item[column.key];
                      }else{
                        modelo[column.key] = "";
                      }
                    }
                  }
                });
                list.push(modelo);
              });
      
              this.listCustomerCharges = list.sort( (a,b)=> { return a['CHARGID']-b['CHARGID']; }  );
            }else{
              this.listCustomerCharges = [];
            }
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        });
      break;
    }
  }

  changeDateTime(event: any, field: string, form: FormGroup){
    if(event != null && event.detail != null && event.detail.value != null){
      form.get(field).setValue(event.detail.value);
    }
  }

  uploadFile(id: string,event: any){

    event.preventDefault();
    if(event != null && event.detail != null && event.detail.files != null){
      let tiposValidados: string[] = ["application/vnd.rar","application/x-rar-compressed","application/zip","application/x-zip-compressed",
      "image/png","image/jpeg","image/gif", "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      let fileUpload: File = event.detail.files[0];

      if(fileUpload != null && !tiposValidados.some(x => x === fileUpload.type)){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Only .png, .jpg, .jpeg, .gif, .pdf, .docx, .doc, .rar, .zip extensions are allowed',
              showConfirmButton: true,
              timer: 2000,
            });
            return;
      }

      if(fileUpload.size > 3000000){
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'The attachment cannot exceed 3Mb',
            showConfirmButton: true,
            timer: 2000,
          });
          return;
      }

      Swal.fire({
        title: `Are you sure upload ${fileUpload.name}?`,
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, upload!!'
      }).then((result) => {
        if (result.isConfirmed) {
          let modelo = {
            fileRaw: fileUpload,
            fileName: fileUpload.name,
            ID: id,
          };
            //buscamos 
          let deliverySelected = this.listDeliverys.find(x => x['DELIVERYID'] == id);
          deliverySelected['UPLOADATTACHMENT'] = true;
          if(deliverySelected['LASTPODUPLOADBY'] != null && deliverySelected['LASTPODUPLOADBY'].length > 0)
          {
             //0 - url sin nombre //1 - nombre y extension // 2 - vacio
            let name = deliverySelected['LASTPODUPLOADBY'].split(/([^\/=]*\.[a-z]*)$/); 
            this.deliveriesService.deleteAttachment(name[1], id, 6).subscribe(result => {
              this.deliveriesService.CreateAttachments(modelo).subscribe(result => {
                if(result['success']){
                  this.toastEvoke.success(`CREATED`, `${modelo.fileName} CREATED`).subscribe();
                  
                  deliverySelected['LASTPODUPLOADBY'] = result.helper['url'];
                }else{
                  this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
                }
                deliverySelected['UPLOADATTACHMENT'] = false;
              });
            });
          }else{
            this.deliveriesService.CreateAttachments(modelo).subscribe(result => {
              if(result['success']){
                this.toastEvoke.success(`CREATED`, `${modelo.fileName} CREATED`).subscribe();
                
                deliverySelected['LASTPODUPLOADBY'] = result.helper['url'];
              }else{
                this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
              }
              deliverySelected['UPLOADATTACHMENT'] = false;
            });
          }
        }
      });
    }
  }

//OVS
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
      case 'CARRIER':
        this.columnsSelected.push({name: 'MC', key: 'mc',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.columnsSelected.push({name: 'NOTES', key: 'notes',style: '', isID: false,isNAME: false });
        this.filterSearchSelected = 'mc';
      this.getList(this.carrierService,actualizar,suggestions);
      break;
      case 'CUSTOMER':
        this.columnsSelected.push({name: 'MC', key: 'mc',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.columnsSelected.push({name: 'NOTES', key: 'notes',style: '', isID: false,isNAME: false });
        this.filterSearchSelected = 'mc';
      this.getList(this.customerService,actualizar,suggestions);
      break;
      case 'COMMODITY':
        this.columnsSelected.push({name: 'COMMODITYID', key: 'commodityid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'DESCRIPTION', key: 'description',style: '', isID: false,isNAME: true });
        this.filterSearchSelected = 'commodityid';
      this.getList(this.commodityService,actualizar,suggestions);
      break;
      case 'CONSIGNEE':
        this.columnsSelected.push({name: 'CONSIGNEEID', key: 'consigneeid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.filterSearchSelected = 'consigneeid';
      this.getList(this.consigneesService,actualizar,suggestions);
      break;
      case 'SHIPPER':
        this.columnsSelected.push({name: 'SHIPPERID', key: 'shipperid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.filterSearchSelected = 'shipperid';
      this.getList(this.shipperService,actualizar,suggestions);
      break;
      case 'SHIPPER\'S ADDRESS':
        this.columnsSelected.push({name: 'ADDRESSID', key: 'addressid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'ADDRESS', key: 'adress',style: '', isID: false,isNAME: true });
        this.columnsSelected.push({name: 'CITY', key: 'city',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'ZIP CODE', key: 'zipcode',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'PHONE', key: 'phone',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'STATE', key: 'state',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'COUNTRY', key: 'country',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'HOUSE NUMBER', key: 'housenumber',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'STREET', key: 'street',style: '', isID: false,isNAME: false });
        this.filterSearchSelected = 'addressid';
        this.getList(this.shipperAddressService,actualizar,suggestions);
      break;
      case 'CONSIGNEE\'S ADDRESS':
        this.columnsSelected.push({name: 'ADDRESSID', key: 'addressid',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'ADDRESS', key: 'adress',style: '', isID: false,isNAME: true });
        this.columnsSelected.push({name: 'CITY', key: 'city',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'ZIP CODE', key: 'zipcode',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'PHONE', key: 'phone',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'STATE', key: 'state',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'COUNTRY', key: 'country',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'HOUSE NUMBER', key: 'housenumber',style: '', isID: false,isNAME: false });
        this.columnsSelected.push({name: 'STREET', key: 'street',style: '', isID: false,isNAME: false });
        this.filterSearchSelected = 'addressid';
        this.getList(this.consigneeAddressService,actualizar,suggestions);
      break;
    }
  }

  //cuando se detecta que el usuario se encuentra en el input y cuando va escribiendo en el input
  onChange(event: any, index: number): void {
    this.listSuggestionsM = [];
    this.listMSelected = [];

    if(this.fieldsOVS[index].name != null && this.fieldsOVS[index].name.length > 0){
      if(this.fieldsOVS[index].field === 'ADRESS'){
        if(this.fieldsOVS[index].secundary != null){
          if(this.fieldsOVS[index].form.get(this.fieldsOVS[index].secundary.name).value != null 
          && this.fieldsOVS[index].form.get(this.fieldsOVS[index].secundary.name).value.length > 0){
            this.listSelected(index, true, true);
          }
        }
      }
      else{
        this.listSelected(index, true, true);
      }
    }else{
      if(this.fieldsOVS[index].id != null && this.fieldsOVS[index].id.length > 0){

        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue('');
        this.fieldsOVS[index].id = '';
      }
    }
  }

  //cuando el usuario cambia de input, verifica si hay coincidencia si lo hay, lo guarda
  sinEscribir(event: any, index: number){
    //ccuando encuentra coincidencia
    if(this.listSuggestionsM.length > 0 ) {

      let itemSelected = this.listSuggestionsM.find(x => {
        let itemValues: string[] = Object.values(x);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a
      });

      if(itemSelected != null){
        if(this.fieldsOVS[index].id == null || this.fieldsOVS[index].id == '' || itemSelected[this.filterSearchSelected] != this.fieldsOVS[index].id ){
          //buscamos el valor del ID;
          let newID = "";
          let newName = '';
          let columnID = this.columnsSelected.find(x => x.isID).key;
          let columnName = this.columnsSelected.find(x => x.isNAME).key;
          newID = itemSelected[columnID];
          newName = itemSelected[columnName];
    
          //en caso de que sea un adress, significa que va a cambiar varios campos.
          //en caso de que sea un campo que contenga un adress, significa que debe limpiarse los campos del adress. 
          this.changeAddress(index,newID, itemSelected);
    
            if(newID != null && newID != this.fieldsOVS[index].id ){
              if(this.fieldsOVS[index].field === 'ADRESS'){
                this.fieldsOVS[index].id = newID;
                this.fieldsOVS[index].name = newName;
                this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
              }else{
                this.fieldsOVS[index].id = newID;
                this.fieldsOVS[index].name = newName;
                this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
              }
            }
        }
      }else{
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue('');
        this.fieldsOVS[index].id = '';
      }
    }
  }

  changeAddress(index: number, valor: string, row: any){
    if(this.fieldsOVS[index].field === 'ADRESS'){

      this.fieldsOVS[index].secundary.columns.forEach(columnS => {
        //validamos que exista en el form 
        if(this.fieldsOVS[index].form.get(columnS.key) != null){
          if(columnS.key !== 'ADRESS'){
            if(row[columnS.key.toLowerCase()] != null){
              this.fieldsOVS[index].form.get(columnS.key).setValue(row[columnS.key.toLowerCase()]);
            }else{
              this.fieldsOVS[index].form.get(columnS.key).setValue('');
            }

          }
        }
      });
    }
  }

  //Guarda el valor del registro seleccionado en la lista del modal, en el formulario
  changeField(event: IItemSelectedModal){
    let fielOVS = this.fieldsOVS[event.index];
    
    let columnID = this.columnsSelected.find(x => x.isID).key;
    let rowSelected = this.listMSelected.find(x => x[columnID] == event.id);
    if(fielOVS != null){
      if(rowSelected != null){
        this.changeAddress(event.index, event.id, rowSelected);
      }
      
      if(fielOVS.field === 'ADRESS'){
        if(event.id.trim() != fielOVS.id && event.name.trim() != fielOVS.name){
          fielOVS.id = event.id.trim();
          fielOVS.name = event.name.trim();
          fielOVS.form.get(fielOVS.field).setValue(fielOVS.name);
        }
      }else{
        if(event.id.trim() != fielOVS.id && event.name.trim() != fielOVS.name){
          fielOVS.id = event.id.trim();
          fielOVS.name = event.name.trim();
        }
        if(fielOVS.form != null){
          fielOVS.form.get(fielOVS.field).setValue(fielOVS.id);
        }
      }
    }
  }

  suggestionSelected(event : any, index: number){
    if(event != null && event.source != null && event.source.selected){
      let element: ElementRef = event.source.element;
      let columns: DOMStringMap = element.nativeElement.dataset;
      let text : string = columns.name.trim(); 
      let value: string = columns.id.trim(); 
      this.valueField = text;

      let columnID = this.columnsSelected.find(x => x.isID).key;
      let rowSelected = this.listMSelected.find(x => x[columnID] == value);
      if(rowSelected != null){
        this.changeAddress(index, value, rowSelected);
      }

      if(this.fieldsOVS[index].field === 'ADRESS'){
        this.fieldsOVS[index].name = text;
        this.fieldsOVS[index].id = value;
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].name);
      }else{
        this.fieldsOVS[index].name = text;
        this.fieldsOVS[index].id = value;
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
      }
    }
  }

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

  addFiles(array_files: string[]){
    this.shipmentFiles = [];
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
      this.shipmentFiles = listFiles;
    }
  }

}
