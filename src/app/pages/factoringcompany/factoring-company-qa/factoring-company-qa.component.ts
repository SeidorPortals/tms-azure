import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactoringCompanyService } from 'src/app/services/factoringCompanyService/factoring-company.service';
import { UserServiceService } from 'src/app/services/userService/user-service.service';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-factoring-company-qa',
  templateUrl: './factoring-company-qa.component.html',
  styleUrls: ['./factoring-company-qa.component.css']
})
export class FactoringCompanyQaComponent implements OnInit {

  public RegionList: { name: string, code: string }[] = RegionCode;
  public CountryList: { name: string, code: string }[] = CountryCode;

  addForm: FormGroup = this.fb.group({
    "FACTORINGCOMPANYID": [''],
    "NAME": ['',Validators.required],
    "ADDRESS":[''],
    "CITY": [''],
    "STATE": [''],
    "ZIP": [''],
    "CONTACT": [''],
    "PHONE": [''],
    "HOUSENUMBER": [''],
    "STREET": [''],
    "ADVANCEPERCENT": [0],
    "FEEPERCENT": [0],
    "WIRETRANSFERPRICE": [0],
    "INVOICELEGEND": [''],
    "STATUSID": ['1'],
    "CREATEDBY": [this.userService.email],
    "CREATEDON": [new Date()],
    "CHANGEBY": [this.userService.email],
    "CHANGEON": [new Date()],
  });

  constructor(
    private userService: UserServiceService, private toastEvoke: ToastEvokeService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private fb: FormBuilder, private factoringCompanyService: FactoringCompanyService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id !== '.!'){
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('factoringcompany');
        this.addForm.patchValue(tst[0]);
      
        this.addForm.get('CHANGEBY').setValue(this.userService.email);
        this.addForm.get('CHANGEON').setValue(new Date());
      }else{
        this.toastEvoke.danger(`ERROR FACTORING COMPANY 0`, 'FACTORING COMPANY NO FOUND').subscribe();
        this.router.navigate(['./factoringcompany']);
      }
    }
  }

  getByCode(code) {
    let data = JSON.parse(localStorage.getItem('factoringcompany'));
    //console.log(equiptype);
    return data.filter(
      function (data) { return data['FACTORINGCOMPANYID'] == code }
    );
  }



  actionSave(close: boolean = false){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== '.!') {
      try {
        this.factoringCompanyService.EditObj(this.addForm.value).subscribe(data => {
          if(data['success']){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1300
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer && close == true) {
                this.router.navigate(['./factoringcompany']);
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
      this.createObj(close);
    }
  }

  createObj(close: boolean = false) {
    this.factoringCompanyService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && close == true) {
            this.router.navigate(['./factoringcompany']);
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    })
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched;
  }

}
