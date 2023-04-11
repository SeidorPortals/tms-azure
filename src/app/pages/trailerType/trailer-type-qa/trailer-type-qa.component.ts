import { Component, OnInit } from '@angular/core';
import { TrailerTypeService } from 'src/app/services/trailerType/trailer-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-trailer-type-qa',
  templateUrl: './trailer-type-qa.component.html',
  styleUrls: ['./trailer-type-qa.component.css']
})
export class TrailerTypeQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,  private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: TrailerTypeService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "TRAILERTYPE": ['', [Validators.required, Validators.minLength(1)]],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('trailertype');
        this.addForm.patchValue(tst[0]);
        let description = this.addForm.controls['DESCRIPTION'].value.replaceAll('H39' , '\'' );
        description = description.replaceAll('H34' , '\"' );
        this.addForm.controls['DESCRIPTION'].setValue(description);
      }else{
        this.toastEvoke.danger(`ERROR TRAILER TYPE 0`, 'TRAILER TYPE NO FOUND').subscribe();
        this.router.navigate(['./trailertype']);
      }
     
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.trailertype );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.TRAILERTYPE == code }
    );
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }

  createObj(closeScreen: boolean) {
    //console.log(this.addForm.value);
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
            this.router.navigate(['/trailertype']);
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }

    });
  }

  actionsave(addForm, closeScreen: boolean) {
    const id = this.route.snapshot.paramMap.get('id');

    let description = this.addForm.controls['DESCRIPTION'].value.replaceAll('\'', 'H39');
    this.addForm.controls['DESCRIPTION'].setValue(description);

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
                this.router.navigate(['/trailertype']);
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

