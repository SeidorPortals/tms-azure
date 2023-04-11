import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { EquipmentTypeServiceService } from 'src/app/services/equipmentTypeService/equipment-type-service.service';
import { ValidatorService } from 'src/app/services/validator/validator.service';
//import { equipmentTypeConfigModel } from 'src/app/models/equipmentTypeConfig,model';
import Swal from 'sweetalert2'
//import { NgZone } from '@angular/core';


@Component({
  selector: 'app-equipment-type-config-qa',
  templateUrl: './equipment-type-config-qa.component.html',
  styleUrls: ['./equipment-type-config-qa.component.css']
})
export class EquipmentTypeConfigQAComponent implements OnInit {

  //equiptype = new equipmentTypeConfigModel();


  addEquipmentForm: FormGroup = this.formBuilder.group({
    "EQUIPMENTTYPEID": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]],
    "STATUSID": ['1']
    // "createdby": (''),
    // "createdon": (''),
    // "changeby": (''),
    // "changedon": ('')
  })

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  constructor(
    public vs: ValidatorService,  private toastEvoke: ToastEvokeService, 
    private formBuilder: FormBuilder, private route: ActivatedRoute, private ObjServiceService: EquipmentTypeServiceService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    //const idnumber = Number.parseInt(id);
    if (id !== '.!') 
    {
      let tst = this.getEquipByCode(id);
      if(tst != null){
        localStorage.removeItem('equiptype');
      ///this.equiptype = tst[0];
      this.addEquipmentForm.patchValue(tst[0]);
      this.watchChangeEstatus = true;
      this.numberStatus = tst[0]['STATUSID'];
      }else{
        this.toastEvoke.danger(`ERROR EQUIPMENT TYPE 0`, 'EQUIPMENT TYPE NO FOUND').subscribe();
        this.router.navigate(['./equipmenttypes']);
      }
    }else {
      if(this.addEquipmentForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addEquipmentForm.get('STATUSID').value);
      }
    }

    /*this.addEquipmentForm = this.formBuilder.group({
      "equipmenttypeid": new FormControl(''),
      "description": new FormControl(''),
      "createdby": new FormControl(''),
      "createdon": new FormControl(''),
      "changeby": new FormControl(''),
      "changedon": new FormControl('')
    })*/
  }

  getEquipByCode(code) {
    let equiptype = JSON.parse( localStorage.equiptype );
    //console.log(equiptype);
    return equiptype.filter(
      function (equiptype) { return equiptype.EQUIPMENTTYPEID == code }
    );
  }

  validarcampos(campo: string) {
    return this.addEquipmentForm.controls[campo].errors && this.addEquipmentForm.controls[campo].touched
  }

  createEquipment(type: any) {
    this.ObjServiceService.CreateObj(this.addEquipmentForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && type == 2) {
            this.router.navigate(['/equipmenttypes']);
          }else{
            this.watchChangeEstatus = true;
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    })
    //console.log(this.addEquipmentForm.value);
  }

  actionsave(addEquipmentForm, type: any) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '.!') {
      try {
        this.ObjServiceService.EditObj(addEquipmentForm.value).subscribe(data => {
          if(data['success']){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && type == 2) {
                this.router.navigate(['/equipmenttypes']);
              }else{
                this.numberStatus = parseInt(this.addEquipmentForm.get('STATUSID').value);
              }
            });
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        })
      }catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Equipment Type',
          text: error,
          timer: 1500,
          allowOutsideClick: false
        });
      }
    }
    else {
      this.createEquipment(type);
    }
  }

    //Status
    changeStatus(code: number){
      this.addEquipmentForm.get('STATUSID').setValue(code);
      this.actionsave(this.addEquipmentForm, false);
    }
  

}