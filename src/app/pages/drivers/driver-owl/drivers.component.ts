import { Component, HostListener, OnInit } from '@angular/core';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { DriverServiceService } from 'src/app/services/driverService/driver-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {

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
    private toastEvoke: ToastEvokeService,
    private ObjServiceService: DriverServiceService,
    //private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('driverData');
    this.getAllData()
  }


  getAllData() {
    this.ObjServiceService.getAll().subscribe(
      resp => {
        if(Array.isArray(resp)){
          if(resp.length > 0){
            this.ObjList = resp;
            this.ObjList = resp;
            this.ObjListOriginal = resp;
            localStorage.driverData = JSON.stringify(resp);
          }else{
            this.ObjList = [];
            this.ObjListOriginal = [];
            localStorage.removeItem('driverData');
          }
        }else{
          this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();
        }
    });
  }

  deleteObj(eqid: string) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    var value = "{\"DRIVERID\": " + eqid + "}";
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
        this.ObjServiceService.deleteObj(jvalue).subscribe(resp => {
          if(resp['success']){
          //console.log(data, "Deleted!");
          swalWithBootstrapButtons.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllData();
          }else{
            this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();
          }
        
        });
      }
    })
  }

}
