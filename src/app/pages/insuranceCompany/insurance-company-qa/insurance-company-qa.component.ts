import { Component, OnInit } from '@angular/core';
import { InsuranceCompanyService } from 'src/app/services/insuranceCompany/insurance-company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-insurance-company-qa',
  templateUrl: './insurance-company-qa.component.html',
  styleUrls: ['./insurance-company-qa.component.css']
})
export class InsuranceCompanyQaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,  private toastEvoke: ToastEvokeService,
    private route: ActivatedRoute, private ObjServiceService: InsuranceCompanyService, private router: Router) { }

  addForm: FormGroup = this.formBuilder.group({
    "INSURANCECOMPANY": [''],
    "DESCRIPTION": ['', [Validators.required, Validators.minLength(1)]]
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        this.addForm.patchValue(tst[0]);
      }else{
        this.toastEvoke.danger(`ERROR INSURANCE COMPANY 0`, 'INSURANCE COMPANY NO FOUND').subscribe();
        this.router.navigate(['./insuranceCompany']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.insurancecompany );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.INSURANCECOMPANY == code }
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
            this.router.navigate(['/insuranceCompany']);
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
                this.router.navigate(['/insuranceCompany']);
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
