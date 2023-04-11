import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ShipperServiceService } from 'src/app/services/shipperService/shipper-service.service';
import { ShipperaddressServiceService } from 'src/app/services/shipperaddress/shipperaddress-service.service';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-shipper-qa',
  templateUrl: './shipper-qa.component.html',
  styleUrls: ['./shipper-qa.component.css']
})
export class ShipperQAComponent implements OnInit {
  
  addShipperForm: FormGroup = new FormGroup({});
  closeResult: string = '';
  public RegionList:{code:string, name:string}[] = RegionCode;
  public CountryList:{code:string, name:string}[] = CountryCode;

    //status btn 
    watchChangeEstatus: boolean = false;
    numberStatus: number = 1;

    //status validation
    statusValid: boolean = true;
    //spinning
    isSpinning: boolean = false;

    modalreference: any = {};


  constructor(private formBuilder: FormBuilder, public vs: ValidatorService,
              private route: ActivatedRoute,  private toastEvoke: ToastEvokeService,
              private ObjServiceService: ShipperServiceService,
              private AddressService : ShipperaddressServiceService,  
              private router: Router,
              private modalService: NgbModal) { }

  addForm: FormGroup = this.formBuilder.group({
    "SHIPPERID": [''],
    "NAME": ['', [Validators.required, Validators.minLength(1)]],
    "STATUSID": ['1'],
    }
  )

  addFormAddress: FormGroup = this.formBuilder.group({
  
    "ADDRESSID": [''], 
    "ADRESS": [''], 
    "CITY": ['', Validators.required], 
    "STATE": ['', Validators.required], 
    "ZIPCODE": ['', Validators.required], 
    "COUNTRY": ['', Validators.required], 
    "PHONE": [''], 
    "SHIPPERID": [''], 
    "STREET": ['', Validators.required], 
    "HOUSENUMBER": ['', Validators.required], 
    
  }
  )
  ObjList = [];
  ObjListOriginal = [];
  filterData = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('shipperData');
        localStorage.removeItem('shipperAdd');

        this.addForm.patchValue(tst[0]);
        this.getAllAddress(id);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
      }else{
        this.toastEvoke.danger(`ERROR SHIPPER 0`, 'SHIPPER NO FOUND').subscribe();
        this.router.navigate(['./shippers']);
      }
    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }

  validarcamposAdd(campo: string) {
    return this.addFormAddress.controls[campo].errors && this.addFormAddress.controls[campo].touched
  }

  createObj(closescreen: boolean) {
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
            this.router.navigate(['/shippers']);
          }else{
            this.watchChangeEstatus = true;
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      
    }
    )
    //console.log(this.addEquipmentForm.value);
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.shipperData );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.SHIPPERID == code }
    );
  }

  

  actionsave(addForm, closescreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    //console.log(closescreen)
    if (id !== '.!' || this.watchChangeEstatus == true) {
      //let tst = this.getByCode(id);

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
                this.router.navigate(['/shippers']);
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
      this.isSpinning = false;
    }
  }

  open(content:any, id: string) 
  {
    this.addFormAddress.controls['SHIPPERID'].setValue(this.addForm.controls['SHIPPERID'].value);
    console.log(this.addFormAddress.controls['ADDRESSID'].value)
    if (id !== '0') 
    {
      let tst = this.getByCodeAddress(id);
      this.addFormAddress.patchValue(tst[0]);
    }
    else
    {
      this.addFormAddress.reset({
        "ADDRESSID": '', 
        "ADRESS": '', 
        "CITY": '', 
        "STATE": '', 
        "ZIPCODE": '', 
        "COUNTRY": '', 
        "PHONE": '', 
        "SHIPPERID": '', 
        "STREET": '', 
        "HOUSENUMBER": '', 
      })
      this.addFormAddress.controls['ADDRESSID'].setValue('0');
    }

    this.modalreference = this.modalService.open(content, { backdrop: false,ariaLabelledBy: 'modal-basic-title'});
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  //////////ADDRESS
  getAllAddress(id: string) 
  {
    let params = { "SHIPPERID": id };
    this.AddressService.getBy(params).subscribe(
      resp => {
        if(Array.isArray(resp)){
          if(resp.length > 0){
            this.ObjList = resp;
            localStorage.shipperAdd = JSON.stringify(resp);
          }else{
            this.ObjList = [];
            localStorage.removeItem('shipperAdd');
          }
        }else{
          this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();
        }
      });
  }
  getByCodeAddress(code: string) {
    this.filterData = this.ObjList.filter( x => x.ADDRESSID == code);
    return this.filterData;
  }

  actionsaveAddress(addFormAddress, closescreen: boolean) 
  {
    const id = this.addFormAddress.controls['ADDRESSID'].value;

    console.log(this.addFormAddress.controls['ADDRESSID'].value);
    if(this.addFormAddress.controls['ADDRESSID'].value == null || this.addFormAddress.controls['ADDRESSID'].value == "")
    {
      this.addFormAddress.controls['ADDRESSID'].setValue('0');
    }
    if (id != 0) 
    {
      try {
        this.AddressService.EditObj(addFormAddress.value).subscribe(data => {
          if(data['success']){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
                //this.router.navigate(['/consignees']);
                //localStorage.clear();
              }
              this.modalreference.close();
            })
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Review your entries',
          text: error,
          timer: 1500,
          allowOutsideClick: false
        });
      }
    }
    else 
    {
      this.createObjAddress(closescreen);
    }
  }

  createObjAddress(closescreen: boolean) 
  {
    //console.log(this.addFormAddress.value);
    this.AddressService.CreateObj(this.addFormAddress.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && closescreen == true) {
            //this.router.navigate(['/consignees']);
            //localStorage.clear();
          }
          this.modalreference.close();
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
     
    })
  }

  changeStatus(code: number){
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }

}
