import { Component, HostListener, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { EquipmentTypeServiceService } from 'src/app/services/equipmentTypeService/equipment-type-service.service';
import Swal from 'sweetalert2';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


export class EquipmentTypeInformation {

  EQUIPMENTTYPEID: number;
  DESCRIPTION: string;
}

@Component({
  selector: 'app-equipment-type-config-owl',
  templateUrl: './equipment-type-config-owl.component.html',
  styleUrls: ['./equipment-type-config-owl.component.css'],
  providers: [RestService]

})

export class EquipmentTypeConfigOWLComponent implements OnInit {
  // addEquipmentID = ({});
  // equipmentID: string = '';
  // listEquipmentType: any;
  // tablaEquipmentType = [];
  // equipmentTable: EquipmentType[] = [];
  // equipmentType: EquipmentTypeInformation = new EquipmentTypeInformation();
  //equipmentTypeForm: FormGroup;
  //equiptype: equipmentTypeConfigModel[];
  //equiptype: equipmentTypeConfigModel = new equipmentTypeConfigModel()

 // private url = 'https://nodequerydis.cfapps.us10.hana.ondemand.com'

  //tablaEquipmentType: equipmentTypeConfigModel[] = [];
  ObjList = [];
  ObjListOriginal = [];

  @HostListener("input", ['$event'])
   oninput() {
     const input = event.target as HTMLInputElement;
     let valueT = input.id;
     if (valueT == 'searchInput')
     {
      if(!input.value)
      {
        this.ObjList = this.ObjListOriginal;
      } 
      else
      {
        this.search(input.value);        
      }
     }
   
  } 

  //// search event for search input 
  search(column: string) {
    if(column) 
    {
      this.ObjList = this.ObjListOriginal.filter( item => {
        let itemValues: string[] = Object.values(item);
        let result = JSON.stringify(itemValues).toLowerCase().indexOf(column.toLowerCase()) > -1 ? 1 : 0;
        return result > 0;
      });
    }    
  }

  constructor(
    private equipmentTypeServiceService: EquipmentTypeServiceService,private toastEvoke: ToastEvokeService,
    //private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('equiptype');

    this.getAllData()

    // this.equipmentTypeServiceService.listEquipments().subscribe(data => {
    //   this.listEquipmentType = data;

    // });




    // this.equipmentTypeForm = this.fb.group({
    //   EQUIPMENTTYPEID: [''],
    //   DESCRIPTION: ['']

    // });



    // this.equipmentTypeServiceService.getAll()
    //   .subscribe(res => {
    //     console.log('res', res);
    //     this.tablaEquipmentType = res;
    //     //console.log(res[0].Description);
    //   })

  }

  getAllData() {
    this.equipmentTypeServiceService.getAll().subscribe(
      resp => {
        if(Array.isArray(resp)){
          if(resp.length > 0){
            this.ObjList = resp;
            this.ObjListOriginal = resp;
            localStorage.equiptype = JSON.stringify(resp);
          }else{
            this.ObjList = [];
            this.ObjListOriginal = [];
            localStorage.removeItem('equiptype');
          }
        }else{
          this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();
        }
       
      });
  }

  deleteEquipment(eqid: string) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    var value = "{\"EQUIPMENTTYPEID\": " + eqid + "}";
    var jvalue = JSON.parse(value);
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipmentTypeServiceService.deleteObj(jvalue).subscribe(data => {
          if(data['success']){
            swalWithBootstrapButtons.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
          this.getAllData();
          }else{
            this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
          }
        });
      }
    })


  }

  //console.log(this.addEquipmentForm.value);    
}
