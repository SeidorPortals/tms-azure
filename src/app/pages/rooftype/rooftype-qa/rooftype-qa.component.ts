import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RoofTypeService } from 'src/app/services/roofType/roof-type.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-rooftype-qa',
  templateUrl: './rooftype-qa.component.html',
  styleUrls: ['./rooftype-qa.component.css']
})
export class RooftypeQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: RoofTypeService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "ROOFTYPE": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('roofType');
        this.addForm.patchValue(tst[0]);
      }else{
        this.toastEvoke.danger(`ERROR ROOF TYPE 0`, 'ROOF TYPE NO FOUND').subscribe();
        this.router.navigate(['./rooftype']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.roofType );
    console.log(data);
    return data.filter(
      function (data) { return data.ROOFTYPE == code }
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
            this.router.navigate(['/rooftype']);
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    })
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
                this.router.navigate(['/rooftype']);
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
