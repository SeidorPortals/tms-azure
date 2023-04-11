import { Component, OnInit } from '@angular/core';
import { TruckServiceService } from 'src/app/services/truckService/truck-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-create-trucks',
  templateUrl: './create-trucks.component.html',
  styleUrls: ['./create-trucks.component.css']
})
export class CreateTrucksComponent implements OnInit {

  //attachments
  truckFiles: FileVM[] = [];
  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;
  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;

  constructor(
    public vs: ValidatorService, private toastEvoke: ToastEvokeService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, public ObjServiceService: TruckServiceService, private router: Router) { }

    
  addForm: FormGroup = this.formBuilder.group({
    "TRUCKNUMBER": ['', [Validators.required, Validators.minLength(1)]],
    "MAKE": [''],
    "TYEAR": [0],
    "LICENSEPLATE": [''],
    "ANNUALINSPECTION": [''],
    "WEIGHT": [0],
	  "UNITCODE": ['LB'],
    "MONITOR": [''],
    "USEMONITOR": [false],
    "MONITORDAYS": [0],
    "PREPASS": [''],
    "EZPASS": [''],
    "CARGO": [false],
    "LIABILITY": [false],
    "PHYSICALDAMAGE": [false],
	  "BOBTAIL": [false],
    "FIFTHWEEL": [false],
    "INVESTOREMAIL": [''],
    "IDNUMBER": [''],
    "LICENSEEXPDATE": [''],
    "FUELCARD": [''],
    "FUELTANKCAPA": [0],
    "FIXEDCOST": [0],
    "ACTIVEDON": [''],
    "DEACTIVEDON": [''],
    "SUNPASS": [''],
    "NOTES": [''],
    "STATUSID": [1],
    "MODEL": ['']
  })



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('trucks');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];

        if(tst[0]['URLS'] != null && tst[0]['URLS'] !== ''){
          let valor: string = tst[0]['URLS'];
          let array_files = valor.split(' ');
          this.addFiles(array_files);
        }

      }else{
        this.toastEvoke.danger(`ERROR TRUCK 0`, 'TRUCK NO FOUND').subscribe();
        this.router.navigate(['./trucks']);
      }
     
    }else{
      if(this.addForm.get('STATUSID').value != null){
        this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
      }
    }

    this.validateStatus();

    this.addForm.valueChanges.subscribe(() => {
      this.validateStatus();
    });
  }

  validateStatus(){
    if(
      this.addForm.invalid ||
      this.addForm.get('TRUCKNUMBER')?.value == "" || this.addForm.get('TRUCKNUMBER')?.value == null ||
      this.addForm.get('LICENSEPLATE')?.value == "" || this.addForm.get('LICENSEPLATE')?.value == null || 
      this.addForm.get('LICENSEEXPDATE')?.value == "" || this.addForm.get('LICENSEEXPDATE')?.value == null ||
      this.addForm.get('ANNUALINSPECTION')?.value == "" || this.addForm.get('ANNUALINSPECTION')?.value == null 
      ){
        this.statusValid = true;
      }else{
        this.statusValid = false;
      }
  }

  getByCode(code) {
    let data = JSON.parse( localStorage.trucks );
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.TRUCKNUMBER == code }
    );
  }

  addFiles(array_files: string[]){
    this.truckFiles = [];
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
      this.truckFiles = listFiles;
    }
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
            this.router.navigate(['/trucks']);
          }else{
            this.watchChangeEstatus = true;
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    }
    )
  }

  actionsave(addForm, closeScreen: boolean) {
    this.isSpinning = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id !== '.!' || this.watchChangeEstatus == true) {
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
                this.router.navigate(['/trucks']);
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
          allowOutsideClick: false
        });
      }
    }
    else {
      this.createObj(closeScreen);
      this.isSpinning = false;
    }
  }

  // @ViewChild('textInput') text: ElementRef;
	// @ViewChild('dateInput') date: ElementRef;
  
	// @Output() addTodo = new EventEmitter();
  
  // constructor() { }

  // ngOnInit(){
  //   var myDateTimePicker; 
  //   myDateTimePicker.addEventListener("change", event => {});
  // }
    
  // handleAddTodo() {
  //   this.addTodo.emit({
  //     text: this.text.nativeElement.value,
  //     date: this.date.nativeElement.value
  //   });
  // }
  
  //Status
  changeStatus(code: number){
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }

  getFiles(files: FileVM){
    console.log(files);
  }
}
