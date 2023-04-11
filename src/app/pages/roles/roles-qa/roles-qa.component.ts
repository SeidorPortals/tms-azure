import { Component,  ElementRef,  OnInit, QueryList, ViewChildren,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

////UI5 Components
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
import { RoleServicesService } from 'src/app/services/roleServices/role-services.service';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


interface ITableModal {
  ID: string;
  NAME: string;
  NOTES: string;
}


@Component({
  selector: 'app-roles-qa',
  templateUrl: './roles-qa.component.html',
  styleUrls: ['./roles-qa.component.css']
})
export class RolesQaComponent implements OnInit {

 
  watchAddShipment: boolean = false;
  //Spinning
  isSpinning: boolean = false;

  //Suggestions
  cotainerSelected: string = '';
  listM: ITableModal[] = [];
  listSuggestionsM: string[] = [];
  @ViewChildren("containerSuggestions") containerSuggestions!: QueryList<ElementRef>;
 
    //status btn 
    watchChangeEstatus: boolean = false;
    numberStatus: number = 1;

    
  constructor(
     public vs:ValidatorService,  private toastEvoke: ToastEvokeService,
     private formBuilder: FormBuilder, 
     private route: ActivatedRoute, private router: Router, 
     private ObjServiceService: RoleServicesService, ) { 

     }

     // "TRIPID": ['TRIP3'], //primary
  addForm: FormGroup = this.formBuilder.group({
    "ROLE_ID": ['', Validators.required],
    "ROLE_NAME": ['', Validators.required],
    "STATUSID": ['1']
  });
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('roleData');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
      }else{
        this.toastEvoke.danger(`ERROR ROLE 0`, 'ROLE NO FOUND').subscribe();
        this.router.navigate(['./roles']);
      }
     
    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }

  }

  getByCode(code) {
    let data = JSON.parse(localStorage.roleData);
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.ROLE_ID == code }
    );
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched;
  }

  createObj(closeScreen: boolean) {
    
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
            this.router.navigate(['/roles']);
          }else{
            this.watchChangeEstatus = true;
          }
        });
        this.isSpinning = false;
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
        this.isSpinning = false;
      }
    }
    )
    //console.log(this.addEquipmentForm.value);
  }

  actionsave(addForm, closeScreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '.!') {
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
              if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
                this.router.navigate(['./roles']);
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
      this.createObj(closeScreen);
    }
  }

  addTextArea(campo: string, event: any){
    if(event != null && event.explicitOriginalTarget != null && event.explicitOriginalTarget.value != null){
      this.addForm.get(campo).setValue(event.explicitOriginalTarget.value);
    }
  }

  actionWatchShipment(valor: boolean){
    //console.log(this.addForm.value);
    this.watchAddShipment = valor;
  }

  //Modal
  changeField(event: string, field: string){
    this.addForm.get(field).setValue(event.trim());
  }

  //suggestions

  //Status
  changeStatus(code: number){
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }






}
