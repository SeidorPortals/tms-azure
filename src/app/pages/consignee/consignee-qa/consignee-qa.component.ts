import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CosigneeServiceService } from 'src/app/services/cosigneeService/cosignee-service.service';
import { ConsigneeaddressService } from 'src/app/services/consigneeaddressService/consigneeaddress.service';

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
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Panel";
import "@ui5/webcomponents-icons/dist/save.js";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


@Component({
  selector: 'app-consignee-qa',
  templateUrl: './consignee-qa.component.html',
  styleUrls: ['./consignee-qa.component.css']
})
export class ConsigneeQAComponent implements OnInit {
  closeResult: string = '';
  public RegionList: { name: string, code: string }[] = RegionCode;
  public CountryList: { name: string, code: string }[] = CountryCode;

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;

  modalReference: any = {};

  constructor(private formBuilder: FormBuilder, public vs: ValidatorService,
    private route: ActivatedRoute, private toastEvoke: ToastEvokeService,
    private ObjServiceService: CosigneeServiceService,
    private AddressService: ConsigneeaddressService,
    private router: Router,
    private modalService: NgbModal) { }


  addForm: FormGroup = this.formBuilder.group({
  
    "CONSIGNEEID": [''],
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
    "CONSIGNEEID": [''], 
    "STREET": ['', Validators.required], 
    "HOUSENUMBER": ['', Validators.required], 
  }
  )
  ObjList = [];
  ObjListOriginal = [];
  filterData = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(this.RegionList);
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('consignee');
        localStorage.removeItem('consigneeAdd');
        
        this.addForm.patchValue(tst[0]);
        this.getAllAddress(id);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
      }else{
        this.toastEvoke.danger(`ERROR CONSIGNEE 0`, 'CONSIGNEE NO FOUND').subscribe();
        this.router.navigate(['./consignees']);
      }
    
    } else {
      if (this.addForm.get('STATUSID').value != null) {
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
            this.router.navigate(['/consignees']);
           }else{
            this.watchChangeEstatus = true;
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      this.isSpinning = false;
    });
    //console.log(this.addEquipmentForm.value);
  }

  getByCode(code) {
    let data = JSON.parse(localStorage.consignee);
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.CONSIGNEEID == code }
    );
  }



  actionsave(addForm, closescreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    //console.log("Save");
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
                this.router.navigate(['/consignees']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
            });
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

  open(content: any, id: string) {
    //console.log(this.addForm.controls['CONSIGNEEID'].value);
    if (id !== '.!') {
      let tst = this.getByCodeAddress(id);
      this.addFormAddress.patchValue(tst[0]);
    }
    else {
      this.addFormAddress.controls['CONSIGNEEID'].setValue(this.addForm.controls['CONSIGNEEID'].value);
      this.addFormAddress.controls['ADDRESSID'].setValue('');
    }
    this.modalReference = this.modalService.open(content, { backdrop: false, ariaLabelledBy: 'modal-basic-title' });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllAddress(id: string) {

    let params = { "CONSIGNEEID": id };
    this.AddressService.getBy(params).subscribe(
      resp => {
        if(Array.isArray(resp)){
          if(resp.length > 0){
            this.ObjList = resp;
            localStorage.consigneeAdd = JSON.stringify(resp);
          }else{
            this.ObjList = [];
            localStorage.removeItem('consigneeAdd');
          }
        }else{
          this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();
        }
      
      });
  }
  getByCodeAddress(code: string) {
    this.filterData = this.ObjList.filter(x => x.ADDRESSID == code);
    return this.filterData;
  }

  actionsaveAddress(addFormAddress, closescreen: boolean) 
  {
    const id = this.addFormAddress.get('ADDRESSID')?.value;
    //console.log(id);
    if (id != '') {
      // let tst = this.getByCode(id);
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
              } else {
                this.watchChangeEstatus = true;
              }
              this.modalReference.close();
            });
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
    else {
      this.createObjAddress(closescreen);
    }
  }

  createObjAddress(closescreen: boolean) {
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
          }
          this.modalReference.close();
        });
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe(); 
      }
    }
    )
  }

  //Status
  changeStatus(code: number) {
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }


}
