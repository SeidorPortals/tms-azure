import { Component,  ElementRef,  OnInit,ViewChild,  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

////UI5 Components
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab"; 
import "@ui5/webcomponents/dist/TabSeparator"; 
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/DatePicker";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents-icons/dist/cancel.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents/dist/RadioButton";
import "@ui5/webcomponents-icons/dist/save.js";
import { UserServiceService } from 'src/app/services/userService/user-service.service';
import { RoleServicesService } from 'src/app/services/roleServices/role-services.service';
import { UserfindetailsService } from 'src/app/services/userfindetailsService/userfindetails.service';
import { IColumnTable, IListBasic } from 'src/app/models/list.viewmodel';
import { IColumnModal, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

interface ITableModal {
  ID: string;
  NAME: string;
  NOTES: string;
}

@Component({
  selector: 'app-user-qa',
  templateUrl: './user-qa.component.html',
  styleUrls: ['./user-qa.component.css']
})
export class UserQaComponent implements OnInit {

       // "TRIPID": ['TRIP3'], //primary
       addForm: FormGroup = this.formBuilder.group({
        "USER_ID": ['', Validators.required],
        "EMAIL": ['', Validators.required],
        "PASSWORD": ['', Validators.minLength(5)],
        "NOMBRE": ['', Validators.required],
        "ROLE_ID": [''],
        "BYD_EMPLOYEE": [''],
        "STATUS": [1],
        "CANSEEPASS": [true],
      });
    
      addFinDetails: FormGroup = this.formBuilder.group({
        "COMPANY": ['',Validators.required],
        "MANAGER": ['', Validators.required],
        "ACCASSIGMENT": ['',Validators.required],
        "COSTOBJECT": ['', Validators.required],
        "USER_ID": ['',Validators.required],
      });
  
  //id
  userID: string = '';
  companyID: string = '';
  //Modal
    titleModal: string = '';
    @ViewChild('details') detailsModal: ElementRef;
  //Suggestions
    listSuggestionsM: any = [];
    valueField: string = '';
  //OVS
    columnsSelected: IColumnModal[] = [];
    listMSelected: any = [];
    indexSelected: number = 0;
    filterSearchSelected: string = '';
    watchOVS: boolean = false;
  
    fieldOVSSelected: IItemSelectedModal = {
      id: '',
      name: '',
      field: '',
      title: '',
      index: 0,
      form: null,
    };
    fieldsOVS: IItemSelectedModal[] = [
      { id: '', name: '', field: 'COMPANY', title: 'COMPANY', index: 0, form: this.addFinDetails},
      { id: '', name: '', field: 'ROLE_ID', title: 'ROLE', index: 1, form: this.addForm}
    ];

  listFinDetails: any[] = [];
  columnsFinDetails: IColumnTable[] = [
    { title: "ID" , key: "USERSFINDETAILSID", type: "NUMBER", watch: false }, { title: "Company" , key: "COMPANYNAME", type: "TEXT", select: true },
    { title: "COMPANY_ID" , key: "COMPANY", type: "TEXT", watch: false },
    { title: "Account Assignment" , key: "ACCASSIGMENT", type: "TEXT" }, { title: "Cost Object" , key: "COSTOBJECT", type: "TEXT" },
    { title: 'Actions', key: '', type: 'TEXT' }
  ]

  //status btn 
  watchChangeEstatus: boolean = false;
  numberStatus: number = 1;

  //status validation
  statusValid: boolean = true;
  //spinning
  isSpinning: boolean = false;

  constructor(private formBuilder: FormBuilder, public vs:ValidatorService,
     private roleServices: RoleServicesService,  private toastEvoke: ToastEvokeService,
     private companyService: CompanyService,   private userFinDetailsService: UserfindetailsService,
     private route: ActivatedRoute, private router: Router, 
     private ObjServiceService: UserServiceService, ) { 

     }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== '.!') {
      this.userID = id;
      let tst = this.getByCode(id);
      if(tst != null){
        localStorage.removeItem('users');
        this.addForm.patchValue(tst[0]);

        let ovsEncontrados: IListBasic[] = [{ ID: 'ROLE_ID', NAME: 'ROLE_ID'} ];
        ovsEncontrados.forEach(ovs => {
          let ovsSelected = this.fieldsOVS.find(x => x.field === ovs['ID'])
          if(ovsSelected != null){
            ovsSelected.id = tst[0][ovs['ID']];
            ovsSelected.name = tst[0][ovs['NAME']];
          }
        });
        this.watchChangeEstatus = true;
        this.numberStatus = tst[0]['STATUS'];
      }else{
        this.toastEvoke.danger(`ERROR USER 0`, 'USER NO FOUND').subscribe();
        this.router.navigate(['./users']);
      }
      this.getFinDetails();
    }

    this.validateStatus();

    this.addForm.valueChanges.subscribe(() => {
      this.validateStatus();
    });
  }

  validateStatus(){
    if(
      this.addForm.invalid ||
      this.addForm.get('PASSWORD')?.value == "" || this.addForm.get('PASSWORD')?.value == null ||
      this.addForm.get('ROLE_ID')?.value == "" || this.addForm.get('ROLE_ID')?.value == null || 
      this.addForm.get('BYD_EMPLOYEE')?.value == "" || this.addForm.get('BYD_EMPLOYEE')?.value == null ||
      this.listFinDetails.length <= 0
      ){
        this.statusValid = true;
      }else{
        this.statusValid = false;
      }
  }

  getByCode(code) {
    let data = JSON.parse(localStorage.users);

    return data.filter(
      function (data) { return data.USER_ID == code }
    );
  }

  validarcampos(campo: string, form: FormGroup) {
    return form.controls[campo].errors && form.controls[campo].touched;
  }

  createObj(closeScreen: boolean, modal: boolean = false, type: string = '') {
    let user: string = this.addForm.get('USER_ID').value;
    this.addForm.get('USER_ID').setValue(user.toUpperCase().trim());

    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      if(data['success']){
        if(!modal){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1300
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
              this.router.navigate(['/users']);
            }else{
              this.userID = this.addForm.get('USER_ID').value;
              this.watchChangeEstatus = true;
            }
          });
        }else{
          this.userID = this.addForm.get('USER_ID').value;
          this.existUSER(type);
        }
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
      this.isSpinning = false;
    });
  }

  actionsave(addForm, closeScreen: boolean) {
    this.isSpinning = true;
    if (this.userID != null && this.userID.length > 0) {

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
                this.router.navigate(['/users']);
              }else{
                this.numberStatus = parseInt(this.addForm.get('STATUS').value);
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
    }
  }

  addTextArea(campo: string, event: any){
    if(event != null && event.explicitOriginalTarget != null && event.explicitOriginalTarget.value != null){
      this.addForm.get(campo).setValue(event.explicitOriginalTarget.value);
    }
  }


  //MODAL
  
  showModal(type: string,  id: string = ''){
    let params = {};
    switch(type){
      case 'DETAILS':
        this.fieldsOVS.forEach(item => {
          if(item.index === 0){
            item.id ='';
            item.name = '';
          }
        });

        if(id != ''){
          //edit 
          this.titleModal = 'EDIT DETAILS';
          params = { 'USERSFINDETAILSID': id  }
          this.userFinDetailsService.getBy(params).subscribe(data => {
            if(data != null && data.length == 1){
              this.userID = data[0]['USER_ID'];
              this.addFinDetails.reset({
                "COMPANY": data[0]['COMPANY'],
                "MANAGER": data[0]['MANAGER'],
                "ACCASSIGMENT": data[0]['ACCASSIGMENT'],
                "COSTOBJECT": data[0]['COSTOBJECT'],
                "USER_ID": data[0]['USER_ID'],
              });
              this.companyID = data[0]['COMPANY'];

              this.addFinDetails.setControl('USERSFINDETAILSID', new FormControl(data[0]['USERSFINDETAILSID']));

              let ovs: string[] = ['COMPANY'];
              ovs.forEach(item => {
                let fieldOVS = this.fieldsOVS.find(x => x.field === item);
                switch(item){
                  case 'COMPANY':
                    if(fieldOVS != null){
                      fieldOVS.id = data[0][item];
                      fieldOVS.name = data[0]['COMPANYNAME'] != null ? data[0]['COMPANYNAME'] : '';
                    }
                  break;
                }
              });

              this.detailsModal.nativeElement.show();
              
            }
          });

        }else{
          //create
          this.companyID = '';
          this.titleModal = 'CREATE DETAILS';
          this.addFinDetails.reset({
            "COMPANY": '',
            "MANAGER": '',
            "ACCASSIGMENT": '',
            "COSTOBJECT": '',
            "USER_ID": this.addForm.get('USER_ID')?.value,
          });

          this.addFinDetails.removeControl('USERSFINDETAILSID');

          this.detailsModal.nativeElement.show(); 
        }

      break;
    }
  }

  closeModal(type: string){
    switch(type){
      case 'DETAILS': this.detailsModal.nativeElement.close(); break;
    }
  }

  saveFormModal(action: string){
        let actionSecundario = '';
    switch(action){
      case 'DETAILS':
        if(this.addFinDetails.get('USERSFINDETAILSID') != null && this.addFinDetails.get('USERSFINDETAILSID').value != null){
          actionSecundario = 'EDIT DETAILS';
        }else{
          actionSecundario = 'CREATE DETAILS';
        }
      break;
    }

    switch(actionSecundario){
      case 'CREATE DETAILS': case 'EDIT DETAILS':
        this.existUSER(actionSecundario);
      break;
      default: //error
      break;
    }
  }

  existUSER(operacion: string){
    //buscamos el usuario para ver si ya esta guardado en la base de datos.
    if(this.userID != null && this.userID.length > 0){
      switch(operacion){
        case 'CREATE DETAILS':
          this.userFinDetailsService.CreateObj(this.addFinDetails.value).subscribe(data => {
            if(data['success']){
              this.getFinDetails();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1300
              });
              this.detailsModal.nativeElement.close();
            }else{
              this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
            }
          });
        break;
        case 'EDIT DETAILS':
          this.userFinDetailsService.EditObj(this.addFinDetails.value).subscribe(data => {
            if(data['success']){
              this.getFinDetails();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your work has been saved',
                timer: 1300
              });
              this.detailsModal.nativeElement.close();
            }else{
              this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
            }
          });
        break;
      }
    }else{
      this.createObj(false,true, operacion);
    }
  }

  getFinDetails(){
    let params = { USER_ID: this.userID }
    this.listFinDetails = [];
    this.userFinDetailsService.getBy(params).subscribe(details => {
      if(details != null && Array.isArray(details) && details.length > 0){
        let list: any = [];
        details.forEach( (item: any) => {
          let modelo: any = {};
          
          this.columnsFinDetails.forEach(column => {
            if(column.key != null){
              if(item[column.key] != null){
                modelo[column.key] = item[column.key];
              }else{
                modelo[column.key] = "";
              }
            }
          });
          list.push(modelo);
        });

        this.listFinDetails = list.sort( (a,b)=> { return a['USERSFINDETAILSID']-b['USERSFINDETAILSID']; }  );
      }else{
        this.listFinDetails = [];
      }
      this.validateStatus();
    });
  }

  confirmDelete(type: string, id: string){
    switch(type){
      case 'DETAILS': this.confirmDeleteAction(this.userFinDetailsService, type, 'USERSFINDETAILSID', id); break;
      default: break;
    }
  }

  confirmDeleteAction(service: any, type: string, field: string,  id: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let params = {};
        params[field] = id;
        service.deleteBy(params).subscribe(result => {
          if(result['success']){
            Swal.fire({
              title: 'Deleted!',
              text: 'Your details has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1300,
            });
            this.getFinDetails();
            this.validManyDetails();
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }
    })
  }

  //suggestions
  //filtrado de las suggestions
  loadSuggestions(){
    if(this.listMSelected.length > 0 && this.valueField != null && this.valueField.length > 0){
      this.listSuggestionsM = this.listMSelected.filter( item => {
        let itemValues: string[] = Object.values(item);
        //let jsonItem = JSON.stringify(itemValues);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a > 0;
      });
    }
  }
  //modal 
  //evento de respuesta cuando el modal se cierra
  closeModalDropdown(event: boolean){
    this.watchOVS = event;
  }

  //definición de las columnas para la lista.
  listSelected(index: number, actualizar: boolean = false, suggestions: boolean = false){
    this.columnsSelected = [];
    if(!actualizar || suggestions){
      this.fieldOVSSelected = this.fieldsOVS[index];
      this.valueField = this.fieldsOVS[index].name;
    }    

    switch(this.fieldsOVS[index].title){
      case 'COMPANY':
        this.columnsSelected.push({name: 'COMPANY', key: 'company',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'name',style: '', isID: false,isNAME: true });
        this.filterSearchSelected = 'company';
        this.getList(this.companyService,actualizar,suggestions);
      break;
      case 'ROLE':
        this.columnsSelected.push({name: 'ID', key: 'role_id',style: '', isID: true,isNAME: false });
        this.columnsSelected.push({name: 'NAME', key: 'role_name',style: '', isID: false,isNAME: true });
        this.filterSearchSelected = 'role_id';
        this.getList(this.roleServices,actualizar,suggestions);
      break;
    }

  }

  //cuando se detecta que el usuario se encuentra en el input y cuando va escribiendo en el input
  onChange(event: any, index: number): void {
    this.listSuggestionsM = [];
    this.listMSelected = [];

    if(this.fieldsOVS[index].name != null && this.fieldsOVS[index].name.length > 0){
      if(this.fieldsOVS[index].field === 'ADRESS'){
        if(this.fieldsOVS[index].secundary != null){
          if(this.fieldsOVS[index].form.get(this.fieldsOVS[index].secundary.name).value != null && this.fieldsOVS[index].form.get(this.fieldsOVS[index].secundary.name).value.length > 0){
            this.listSelected(index, true, true);
          }
        }
      }
      else{
        this.listSelected(index, true, true);
      }
    }else{
      if(this.fieldsOVS[index].id != null && this.fieldsOVS[index].id.length > 0){
        if(this.fieldsOVS[index].secundary != null){
          //limpiamos el id del secundary
          if(this.fieldsOVS[this.fieldsOVS[index].secundary.index].id != null && this.fieldsOVS[this.fieldsOVS[index].secundary.index].id.length > 0){
            this.fieldsOVS[this.fieldsOVS[index].secundary.index].id = '';
            this.fieldsOVS[this.fieldsOVS[index].secundary.index].name = '';
            this.fieldsOVS[index].form.get(this.fieldsOVS[index].secundary.name).setValue('');
          }
        }

        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue('');
        this.fieldsOVS[index].id = '';
      }
    }
  }

  //cuando el usuario cambia de input, verifica si hay coincidencia si lo hay, lo guarda
  sinEscribir(event: any, index: number){
    //ccuando encuentra coincidencia
    if(this.listSuggestionsM.length > 0 ) {
      let itemSelected = this.listSuggestionsM.find(x => {
        let itemValues: string[] = Object.values(x);
        let a = JSON.stringify(itemValues).toLowerCase().indexOf(this.valueField.toLowerCase()) > -1 ? 1 : 0;
        return a
      });
      if(itemSelected != null){
        if(this.fieldsOVS[index].id == null || this.fieldsOVS[index].id == '' || itemSelected[this.filterSearchSelected] != this.fieldsOVS[index].id ){
          //buscamos el valor del ID;
          let newID = "";
          let newName = '';
          let columnID = this.columnsSelected.find(x => x.isID).key;
          let columnName = this.columnsSelected.find(x => x.isNAME).key;
          newID = itemSelected[columnID];
          newName = itemSelected[columnName];
    
            if(newID != null && newID != this.fieldsOVS[index].id ){
              
              if(this.fieldsOVS[index].field === 'ROLE_ID'){
                this.fieldsOVS[index].id = newID;
                this.fieldsOVS[index].name = newID;
                this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
              }else{
                this.fieldsOVS[index].id = newID;
                this.fieldsOVS[index].name = newName;
                this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
              }

              
            }
        }
      }else{
  
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue('');
        this.fieldsOVS[index].id = '';
      }

    }
  }
  //Guarda el valor del registro seleccionado en la lista del modal, en el formulario
  changeField(event: IItemSelectedModal){
    let fielOVS = this.fieldsOVS[event.index];
    if(fielOVS != null){
      
      if(fielOVS.field === 'ROLE_ID'){
        fielOVS.id = event.id.trim();
        fielOVS.name = event.id.trim();
  
        if(fielOVS.form != null){
          fielOVS.form.get(fielOVS.field).setValue(fielOVS.id);
        }
      }else{
        fielOVS.id = event.id.trim();
        fielOVS.name = event.name.trim();
  
        if(fielOVS.form != null){
          fielOVS.form.get(fielOVS.field).setValue(fielOVS.id);
        }
      }
    }
  }

  suggestionSelected(event : any, index: number){
    if(event != null && event.source != null && event.source.selected){
      let element: ElementRef = event.source.element;
      let columns: DOMStringMap = element.nativeElement.dataset;
      let text : string = columns.name.trim(); 
      let value: string = columns.id.trim();
      if(this.fieldsOVS[index].field === 'ROLE_ID'){
        this.fieldsOVS[index].name = value;
        this.fieldsOVS[index].id = value;
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
      }else{
        this.fieldsOVS[index].name = text;
        this.fieldsOVS[index].id = value;
        this.fieldsOVS[index].form.get(this.fieldsOVS[index].field).setValue(this.fieldsOVS[index].id);
      }
      this.valueField = this.fieldsOVS[index].name = value;
    }
  }

  getList(service: any, actualizar: boolean = false, suggestions: boolean = false){
    let list: any = [];
    service.getAll().subscribe(data => {
      if(data != null && Array.isArray(data) &&  data.length > 0){
        data.forEach( (item, index) => {
          let model = {};
          this.columnsSelected.forEach(column => {
            model[column.key] = item[`${column.key.toUpperCase()}`];
          });

          if(model['company'] != null){
            let existe =  this.listFinDetails.some(x => this.companyID.length == 0 && x['COMPANY'] == model['company']);
            if(!existe){
              list.push(model);
            }
          }else{
            list.push(model);
          }
          
        });
      }
      this.listMSelected = list;
      if(!actualizar){
        this.watchOVS = true;
      }

      if(suggestions){
        this.loadSuggestions();
      }
    });
  }

  getOption(item: any, type: string){
    let id: string = '';
    let name: string = '';
    let result: string = '';
    this.columnsSelected.forEach(column => {
      if(column.isID){
        id = item[column.key];
      }else if(column.isNAME){
        name = item[column.key];
      }
    });

    switch(type){
      case 'ID': result = id; break;
      case 'NAME': result = name; break;
      case 'OPTION': result = `${id} - ${name}`; break;
    }

    return result;
  }

  changeStatus(code: number){
    this.addForm.get('STATUS').setValue(code);
    this.actionsave(this.addForm, false);
  }

  validManyDetails(){
    let params = { USER_ID: this.userID }
    this.userFinDetailsService.getBy(params).subscribe(details => {
      if(details != null && Array.isArray(details) && details.length > 0){
        return;
      }else{
        this.changeStatus(1);
      }
    });
  }
  
}
