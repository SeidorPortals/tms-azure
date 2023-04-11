import { Component, OnInit } from '@angular/core';
import { DriverTypeServiceService } from 'src/app/services/driverTypeService/driver-type-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-driver-type-qa',
  templateUrl: './driver-type-qa.component.html',
  styleUrls: ['./driver-type-qa.component.css']
})

export class DriverTypeQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,   private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: DriverTypeServiceService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "DRIVERTYPE": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('drivertype');
        this.addForm.patchValue(tst[0]);
      }else{
        this.toastEvoke.danger(`ERROR DRIVER TYPE 0`, 'DRIVER TYPE NO FOUND').subscribe();
        this.router.navigate(['./drivertype']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.drivertype );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.DRIVERTYPE == code }
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
            this.router.navigate(['/drivertype']);
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    })
  }

  actionsave(addForm, closeScreen: boolean) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '.!') {
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
                this.router.navigate(['/drivertype']);
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

}
