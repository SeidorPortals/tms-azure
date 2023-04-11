import { Component, OnInit } from '@angular/core';
import { CommodityServiceService } from 'src/app/services/commodityService/commodity-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-create-comodity',
  templateUrl: './create-comodity.component.html',
  styleUrls: ['./create-comodity.component.css']
})
export class CreateComodityComponent implements OnInit {

    //status btn 
    watchChangeEstatus: boolean = false;
    numberStatus: number = 1;

    
  constructor(
    public vs: ValidatorService, private toastEvoke: ToastEvokeService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, private ObjServiceService: CommodityServiceService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "COMMODITYID": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]],
    "STATUSID": ['1']
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('commodity');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
      }else{
        this.toastEvoke.danger(`ERROR COMMODITY 0`, 'COMMODITY NO FOUND').subscribe();
        this.router.navigate(['./commodity']);
      }
    
    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.commodity );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.COMMODITYID == code }
    );
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
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
            this.router.navigate(['/commodity']);
          }else{
            this.watchChangeEstatus = true;
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    });
    //console.log(this.addEquipmentForm.value);
  }

  actionsave(addForm, closeScreen: boolean) {
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
                this.router.navigate(['/commodity']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
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
    else {
      this.createObj(closeScreen);
    }
  }
      //Status
      changeStatus(code: number){
        this.addForm.get('STATUSID').setValue(code);
        this.actionsave(this.addForm, false);
      }

}
