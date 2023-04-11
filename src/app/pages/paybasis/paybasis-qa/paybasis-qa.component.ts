import { Component, OnInit } from '@angular/core';
import { PaybasisService } from 'src/app/services/paybasis/paybasis.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


@Component({
  selector: 'app-paybasis-qa',
  templateUrl: './paybasis-qa.component.html',
  styleUrls: ['./paybasis-qa.component.css']
})
export class PaybasisQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,  private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: PaybasisService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "PAYBASIS": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('paybasis');
        this.addForm.patchValue(tst[0]);
      }else{
        this.toastEvoke.danger(`ERROR PAYBASIS 0`, 'PAYBASIS NO FOUND').subscribe();
        this.router.navigate(['./paybasis']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.paybasis );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.PAYBASIS == code }
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
            this.router.navigate(['/paybasis']);
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    });
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
                this.router.navigate(['/paybasis']);
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
