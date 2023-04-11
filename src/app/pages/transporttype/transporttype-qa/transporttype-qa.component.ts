import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TransporttypeService } from 'src/app/services/transporttype/transporttype.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-transporttype-qa',
  templateUrl: './transporttype-qa.component.html',
  styleUrls: ['./transporttype-qa.component.css']
})
export class TransporttypeQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,  private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: TransporttypeService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "TRANSPORTTYPE": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('commodity');
        this.addForm.patchValue(tst[0]);
      }else{
        this.toastEvoke.danger(`ERROR TRANSPORT TYPE 0`, 'TRANSPORT TYPE NO FOUND').subscribe();
        this.router.navigate(['./transporttype']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.commodity );
    console.log(data);
    return data.filter(
      function (data) { return data.TRANSPORTTYPE == code }
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
            this.router.navigate(['/transporttype']);
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
                this.router.navigate(['/transporttype']);
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
