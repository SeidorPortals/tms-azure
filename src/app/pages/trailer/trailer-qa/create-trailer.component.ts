import { Component,ElementRef, OnInit } from '@angular/core';
import { TrailerServiceService } from 'src/app/services/trailerService/trailer-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { TrailerTypeService } from 'src/app/services/trailerType/trailer-type.service';
import { IColumnModal, IItemSelectedModal, } from 'src/app/models/modal-dropdown.viewmodel';
import { RoofTypeService } from 'src/app/services/roofType/roof-type.service';
import { FileVM } from 'src/app/models/upload-attachment.viewmodel';
import { IListBasic } from 'src/app/models/list.viewmodel';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-create-trailer',
  templateUrl: './create-trailer.component.html',
  styleUrls: ['./create-trailer.component.css']
})
export class CreateTrailerComponent implements OnInit {

    //status btn 
    watchChangeEstatus: boolean = false;
    numberStatus: number = 1;

    //attachments
    trailerFiles: FileVM[] = [];

    //status validation
    statusValid: boolean = true;
    //spinning
    isSpinning: boolean = false;

    constructor(
      public vs: ValidatorService, private toastEvoke: ToastEvokeService,
      private formBuilder: FormBuilder, 
      private route: ActivatedRoute, 
      public ObjServiceService: TrailerServiceService,
      private router: Router,
      private trailerTypeService: TrailerTypeService,
      private roofTypeService: RoofTypeService,) { }

    addForm: FormGroup = this.formBuilder.group({
      "TRAILERNUMBER": ['', [Validators.required, Validators.minLength(1)]],
      "TRAILERTYPE": [''],
      "MAKE": (''),
      "OWNER": (''),
      "TYEAR": (''),
      "IDNUMBER": ('1'),
      "LICENSEPLATE": (''),
      "LICENSEEXPDATE": ['',[Validators.minLength(1)]],
      "ANNUALINSPECTION": (''),
      "PHYSICALDAMAGE": (false),
      "ROOFTYPE": (''),
      "WEIGHT": (0),
      "UNITCODE": ["LB"],
      "VENTILATION": (false),
      "AIR": (false),
      "WHEELREPOSITION": (false),
      "NOTES": (''),
      "STATUSID": (1),
    })

     //Modal OVS
    filterSearch: string = '';
    columnsSelected: IColumnModal[] = [];
    listMSelected: any = [];
    watchOVS: boolean = false;

    //Suggestions
    listSuggestionsM: any = [];
    valueField: string = '';
  
    fieldOVSSelected: IItemSelectedModal = {
      id: '',
      name: '',
      field: '',
      title: '',
      index: 0,
    };


  //NO CAMBIAR POSICIONES, SI SE CAMBIA, SE DEBE CAMBIAR TAMBIEN EN EL HTML
    fieldsOVS: IItemSelectedModal[] = [
      { id: '', name: '', field: 'TRAILERTYPE', title: 'TRAILER TYPE', index: 0 },
      { id: '', name: '', field: 'ROOFTYPE', title: 'ROOF TYPE', index: 1 }
    ];
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== '.!') {
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('trailer');
        this.addForm.patchValue(tst[0]);
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUSID'];

        if(tst[0]['URLS'] != null && tst[0]['URLS'] !== ''){
          let valor: string = tst[0]['URLS'];
          let array_files = valor.split(' ');
          this.addFiles(array_files);
        }
  
        let ovsEncontrados: IListBasic[] =  
        [ { ID: 'TRAILERTYPE', NAME: 'TRAILEREDES' }, { ID: 'ROOFTYPE', NAME: 'ROOFTYPEDES' }];
  
        ovsEncontrados.forEach(ovs => {
          let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID'])
          if(ovsSelected != null){
            ovsSelected.id = tst[0][ovs['ID']] != null  ?  tst[0][ovs['ID']] : "" ;
            ovsSelected.name = tst[0][ovs['NAME']] != null && tst[0][ovs['NAME']].length > 0 ? tst[0][ovs['NAME']] : "";
          }
        });
      }else{
        this.toastEvoke.danger(`ERROR TRAILER 0`, 'TRAILER NO FOUND').subscribe();
        this.router.navigate(['./trailers']);
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
      this.addForm.get('TRAILERNUMBER')?.value == "" || this.addForm.get('TRAILERNUMBER')?.value == null ||
      this.addForm.get('TRAILERTYPE')?.value == "" || this.addForm.get('TRAILERTYPE')?.value == null || 
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
    let data = JSON.parse(localStorage.trailer);
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.TRAILERNUMBER == code }
    );
  }

  addFiles(array_files: string[]){
    this.trailerFiles = [];
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
      this.trailerFiles = listFiles;
    }
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched;
  }

  async createObj(type: boolean) {
    let exist = await this.vs.existBy("TRAILERNUMBER",this.addForm.get("TRAILERNUMBER").value, this.ObjServiceService);
    if(exist){
      this.isSpinning = false;
      this.toastEvoke.danger(`ERROR`, `There is already a trailer with the same number`);
      return;
    }
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1300
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer && type == true) {
            this.isSpinning = false;
            this.router.navigate(['/trailers']);
          }else{
            this.watchChangeEstatus = true;
          }
        })
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      this.isSpinning = false;
    })
    //console.log(this.addEquipmentForm.value);
  }

  actionsave(addForm, type: boolean) {
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
              if (result.dismiss === Swal.DismissReason.timer && type == true) {
                this.router.navigate(['/trailers']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUSID').value);
              }
            });
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
      this.createObj(type);
    }
  }

  //Status
  changeStatus(code: number){
    this.addForm.get('STATUSID').setValue(code);
    this.actionsave(this.addForm, false);
  }



  //////////////OVS
  loadSuggestions() {
    if (this.listMSelected.length > 0 && this.valueField != null && this.valueField.length > 0) {
      this.listSuggestionsM = this.listMSelected.filter(item => {
        let itemValues: string[] = Object.values(item);
        //let jsonItem = JSON.stringify(itemValues);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a > 0;
      });
    }
  }

  closeModalDropdown(event: boolean) {
    this.watchOVS = event;
  }

  listSelected(index: number, actualizar: boolean = false, suggestions: boolean = false) {
    this.columnsSelected = [];

    if (!actualizar || suggestions) {
      this.fieldOVSSelected = this.fieldsOVS[index];
      this.valueField = this.fieldsOVS[index].name;
    }
    
    switch (this.fieldsOVS[index].title) 
    {
      
      case 'TRAILER TYPE':
        this.columnsSelected.push({ name: 'TRAILER TYPE ID', key: 'trailertype', style: '', isID: true, isNAME: false });
        this.columnsSelected.push({ name: 'DESCRIPTION', key: 'description', style: '', isID: false, isNAME: true });

        this.getList(this.trailerTypeService, actualizar, suggestions);
        break;
      case 'ROOF TYPE':
          this.columnsSelected.push({ name: 'ROOF TYPE ID', key: 'rooftype', style: '', isID: true, isNAME: false });
          this.columnsSelected.push({ name: 'DESCRIPTION', key: 'description', style: '', isID: false, isNAME: true });
  
          this.getList(this.roofTypeService, actualizar, suggestions);
          break;
    }
  }

  onChange(event: any, index: number): void {
    this.listSuggestionsM = [];
    this.listMSelected = [];
    if (this.fieldsOVS[index].name != null && this.fieldsOVS[index].name.length > 0) {
      this.listSelected(index, true, true);
    } else {
      this.addForm.get(this.fieldsOVS[index].field).setValue('');
      this.fieldsOVS[index].id = '';

    }
  }

  sinEscribir(event: any, index: number) {
    if (this.listSuggestionsM.length > 0 && (this.fieldsOVS[index].id == null || this.fieldsOVS[index].id == '')) {
      let itemSelected = this.listSuggestionsM.find(x => {
        let itemValues: string[] = Object.values(x);
        let encontrado = itemValues.find(x => x.toString().toLowerCase() == this.valueField.toLowerCase());
        return encontrado
      });
      let newID = '';
      let newName = '';
      if (itemSelected != null) {
        this.columnsSelected.forEach(column => {
          if (column.isID) {
            newID = itemSelected[column.key];
          } else if (column.isNAME) {
            newName = itemSelected[column.key];
          }
        });

        if (newID != null && newID != this.fieldsOVS[index].id) {
          this.fieldsOVS[index].id = newID;
          this.fieldsOVS[index].name = newName;
          this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
        }

        
      } else 
          this.addForm.get(this.fieldsOVS[index].field).setValue('');
          this.fieldsOVS[index].id = '';
        

      
    }
  }


  changeField(event: IItemSelectedModal) {
    let fielOVS = this.fieldsOVS.find(x => x.field === event.field);
    if (fielOVS != null) {
      fielOVS.id = event.id.trim();
      fielOVS.name = event.name.trim();
      this.addForm.get(event.field).setValue(fielOVS.id);
    }
  }


  suggestionSelected(event: any, index: number) {
    if (event != null && event.source != null && event.source.selected) {
      let element: ElementRef = event.source.element;
      let columns: DOMStringMap = element.nativeElement.dataset;
      let text: string = columns.name.trim();
      let value: string = columns.id.trim();
      this.fieldsOVS[index].name = text;
      this.fieldsOVS[index].id = value;
      this.addForm.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
    }
  }

  getList(service: any, actualizar: boolean = false, suggestions: boolean = false) {
    let list: any = [];
    service.getAll().subscribe(data => {
      if (data != null && Array.isArray(data) && data.length > 0) {
        data.forEach((item, index) => {
          let model = {};
          this.columnsSelected.forEach(column => {
            model[column.key] = item[`${column.key.toUpperCase()}`];
          });
          list.push(model);
        });
      }
      this.listMSelected = list;
      
      if (!actualizar) {
        this.watchOVS = true;
      }

      if (suggestions) {
        this.loadSuggestions();
      }
    });
  }




  getOption(item: any, type: string) {
    let id: string = '';
    let name: string = '';
    let result: string = '';
    this.columnsSelected.forEach(column => {
      if (column.isID) {
        id = item[column.key];
      } else if (column.isNAME) {
        name = item[column.key];
      }
    });

    switch (type) {
      case 'ID': result = id; break;
      case 'NAME': result = name; break;
      case 'OPTION': result = `${id} - ${name}`; break;
    }

    return result;
  }

  ////////////////////
  getFiles(files: FileVM){
    console.log(files);
  }

}

