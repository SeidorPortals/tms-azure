import { Component, OnInit, HostListener } from '@angular/core';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { CosigneeServiceService } from 'src/app/services/cosigneeService/cosignee-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-consignee-owl',
  templateUrl: './consignee-owl.component.html',
  styleUrls: ['./consignee-owl.component.css']
})
export class ConsigneeOWLComponent implements OnInit {
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

  constructor(private ObjServiceService: CosigneeServiceService, private toastEvoke: ToastEvokeService,) { }
  
    ngOnInit(): void {
      localStorage.removeItem('consignee');
      localStorage.removeItem('consigneeAdd');
      this.getAllData();
    }
    
    
    getAllData() {
      this.ObjServiceService.getAll().subscribe(
        resp => {
          if(Array.isArray(resp)){
            if(resp.length > 0){
              this.ObjList = resp;
              this.ObjListOriginal = resp;
              localStorage.consignee = JSON.stringify(resp);
            }else{
              this.ObjList = [];
              this.ObjListOriginal = [];
              localStorage.removeItem('consignee');
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
  
      var value = "{\"CONSIGNEEID\": " + eqid + "}";
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
            };
          });
        }
      });
    }
  
    //// search event for search input 
    // search(column: string) {
    //   let nTotal=0;
    //   if(column) 
    //   {
    //     console.log('col');
    //     this.filterData = this.ObjList.filter( x => x.CONSIGNEEID.trim().toLowerCase().includes( column.trim().toLowerCase()));
    //     this.ObjList = this.filterData;
    //   }
    // }

}
