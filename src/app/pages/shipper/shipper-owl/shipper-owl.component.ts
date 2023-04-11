import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { ShipperServiceService } from 'src/app/services/shipperService/shipper-service.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-shipper-owl',
  templateUrl: './shipper-owl.component.html',
  styleUrls: ['./shipper-owl.component.css']
})
export class ShipperOWLComponent implements OnInit {
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

  shippers: any;

  
  constructor(private ObjServiceService: ShipperServiceService,  private toastEvoke: ToastEvokeService,) { }


  ngOnInit(): void {   
    localStorage.removeItem('shipperData');
    localStorage.removeItem('shipperAdd');
    this.getAllData();
  }
  
  
  getAllData() {
    this.ObjServiceService.getAll().subscribe(
      resp => {
        if(Array.isArray(resp)){
          if(resp.length > 0){
            this.ObjList = resp;
            this.ObjListOriginal = resp;
            localStorage.shipperData = JSON.stringify(resp);
          }else{
            this.ObjList = [];
            this.ObjListOriginal = [];
            localStorage.removeItem('shipperData');
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

    var value = "{\"MC\": " + eqid + "}";
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
        this.ObjServiceService.deleteObj(jvalue).subscribe(data => {
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
         
        })
      } 
    })


  }

}


