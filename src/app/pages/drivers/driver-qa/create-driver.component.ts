import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverServiceService } from 'src/app/services/driverService/driver-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import RegionCode from 'src/assets/files/RegionCode.json';
import CountryCode from 'src/assets/files/CountryCode.json';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { isString } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.css']
})
export class CreateDriverComponent implements OnInit {

  public RegionList:{name:string, code:string}[] = RegionCode;
  public CountryList:{name:string, code:string}[] = CountryCode;

  ////saved flags
  saved: boolean = false;
  
  //attachments
  driverFiles: FileVM[] = [];

  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;
  
  addForm: FormGroup = this.formBuilder.group({
    "DRIVERID": ['', [Validators.required, Validators.minLength(1)]],
  	"NAME": ['', [Validators.required, Validators.minLength(1)]],
  	"PAYEENAME": (''),
  	"ADRESS": (''),
  	"CITY": (''),
  	"STATE": (''),
  	"ZIPCODE": (''),
  	"COUNTRY": (''),
    "PHONE": (''),
  	"CELULAREMAIL": ['',[Validators.pattern(this.vs.emailPattern)]],
  	"EMAIL": ['',[Validators.pattern(this.vs.emailPattern)]],
  	"PHONE2": (''),
  	"BIRTHDATE": (''),
  	"SOCIALSECURITY": ['', [Validators.minLength(9)]],
  	"DIRVERLICENSE": (''),
  	"LICENSEEXPDATE": (''),
  	"MEDICALCARDEXPDATE": (''),
  	"ANUALREVIEW": (''),
  	"WORKSTATUSEXPDATE": (''),
  	"MVREXPDATE": (''),
  	"HIREDATE": (''),
  	"PRIMARYFUELCARD": (''),
  	"BONUS": (0),
  	"TERMINATIONDATE": (''),
  	"PAYRALLACCOUNT": (''),
  	"DRIVERTYPE": ('1'),
  	"STATUSID": (1),
  	"NOTES": (''),
  	"HOUSENUMBER": (''),
    "STREET": (''),
  	//"DISPATCHERTYPE": (''),
    //"TRUCKOWNER": ('false')
  })

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  constructor(
    public vs: ValidatorService,  private toastEvoke: ToastEvokeService,
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    public ObjServiceService: DriverServiceService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        this.saved = true;
        localStorage.removeItem('driverData');
        tst[0]["DRIVERTYPE"] = tst[0]["DRIVERTYPE"].toString();
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];
        console.log(this.addForm.get('DRIVERTYPE').value);

        if(tst[0]['URLS'] != null && tst[0]['URLS'] !== ''){
          let valor: string = tst[0]['URLS'];
          let array_files = valor.split(' ');
          this.addFiles(array_files);
        }
        
      }else{
        this.toastEvoke.danger(`ERROR DRIVER 0`, 'DRIVER NO FOUND').subscribe();
        this.router.navigate(['./drivers']);
      }

    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }

    this.validateStatus();

    this.addForm.valueChanges.subscribe((f) => {
      this.validateStatus();
    });
  }

  validateStatus(){
    if(
      this.addForm.invalid ||
      this.addForm.get('PAYEENAME')?.value == "" || this.addForm.get('PAYEENAME')?.value == null ||
      this.addForm.get('CITY')?.value == "" || this.addForm.get('CITY')?.value == null || 
      this.addForm.get('STATE')?.value == "" || this.addForm.get('STATE')?.value == null ||
      this.addForm.get('ZIPCODE')?.value == "" || this.addForm.get('ZIPCODE')?.value == null ||
      this.addForm.get('COUNTRY')?.value == "" || this.addForm.get('COUNTRY')?.value == null ||
      this.addForm.get('SOCIALSECURITY')?.value == "" || this.addForm.get('SOCIALSECURITY')?.value == null ||
      this.addForm.get('DIRVERLICENSE')?.value == "" || this.addForm.get('DIRVERLICENSE')?.value == null ||
      this.addForm.get('LICENSEEXPDATE')?.value == "" || this.addForm.get('LICENSEEXPDATE')?.value == null ||
      this.addForm.get('MEDICALCARDEXPDATE')?.value == "" || this.addForm.get('MEDICALCARDEXPDATE')?.value == null ||
      this.addForm.get('ANUALREVIEW')?.value == "" || this.addForm.get('ANUALREVIEW')?.value == null ||
      this.addForm.get('WORKSTATUSEXPDATE')?.value == "" || this.addForm.get('WORKSTATUSEXPDATE')?.value == null ||
      this.addForm.get('MVREXPDATE')?.value == "" || this.addForm.get('MVREXPDATE')?.value == null ||
      this.addForm.get('HIREDATE')?.value == "" || this.addForm.get('HIREDATE')?.value == null ||
      this.addForm.get('HOUSENUMBER')?.value == "" || this.addForm.get('HOUSENUMBER')?.value == null ||
      this.addForm.get('STREET')?.value == "" || this.addForm.get('STREET')?.value == null ||
      this.addForm.get('PHONE')?.value == "" || this.addForm.get('PHONE')?.value == null ||
      this.addForm.get('BIRTHDATE')?.value == "" || this.addForm.get('BIRTHDATE')?.value == null 
      ){
        this.statusValid = true;
      }else{
        this.statusValid = false;
      }
  }

  getByCode(code) {
    let data = JSON.parse(localStorage.driverData);
    //console.log(data);
    return data.filter(
      function (data) { return data.DRIVERID == code }
    );
  }

  addFiles(array_files: string[]){
    this.driverFiles = [];
    let listFiles: FileVM[] = [];
    if(array_files.length > 0){
      array_files.forEach(array_file => {
        //0 - url sin nombre //1 - nombre y extension // 2 - vacio
        let name = array_file.split(/([^\/=]*\.[a-z]*)$/); 
        listFiles.push({
          name: name[1],
          url: array_file,
          attachment: null,
          data64: ''
        });
      });
      this.driverFiles = listFiles;
    }
  }


  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched
  }

  createObj(closeScreen: boolean) {
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        console.log(data, "created!");
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          this.saved = true;
          if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
            this.router.navigate(['/drivers']);
          }else{
            this.watchChangeEstatus = true;
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      //this.isSpinning = false;
    })
  }

  formatFields(){
    for (let campo in this.addForm.controls) { 
      let control = this.addForm.get(campo);
      if(control.value != null && control.value != "" && typeof control.value == "string"){
        this.addForm.get(campo).setValue(control.value.trim());
      }
    }
  }



  actionsave(addForm, closeScreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.formatFields();

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
                this.router.navigate(['/drivers']);
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
        });
      }
    }
    else 
    {
      console.log("nuevo")
      try 
      {
        this.createObj(closeScreen);
        this.isSpinning = false;
      } 
      catch (error) 
      {
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
  }


  //Status
  changeStatus(code: number){
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }

  getFiles(files: FileVM){
    console.log(files);
  }

}
