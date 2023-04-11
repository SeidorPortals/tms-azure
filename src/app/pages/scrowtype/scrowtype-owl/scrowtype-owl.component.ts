import { Component, OnInit , HostListener } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import Swal from 'sweetalert2';

import { ScrowtypeService } from 'src/app/services/scrowtype/scrowtype.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-scrowtype-owl',
  templateUrl: './scrowtype-owl.component.html',
  styleUrls: ['./scrowtype-owl.component.css']
})
export class ScrowtypeOwlComponent implements OnInit {
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

 filterData: any;
 searchText: string = "";
 ObjList = [];
 ObjListOriginal = [];
 
 constructor(
   private ObjServiceService: ScrowtypeService, private toastEvoke: ToastEvokeService
 ) { }

 ngOnInit(): void {
  localStorage.removeItem('commodity');
  this.getAllData()
}


getAllData() {
  this.ObjServiceService.getAll().subscribe(
    resp => {
      if(Array.isArray(resp)){
        if(resp.length > 0){
          this.ObjList = resp;
          this.ObjListOriginal = resp;
          localStorage.commodity = JSON.stringify(resp);
        }else{
          this.ObjList = [];
          this.ObjListOriginal = [];
          localStorage.removeItem('commodity');
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

  var value = "{\"SCROWTYPE\": " + eqid + "}";
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

//// search event for search input 
search(column: string) {
  let nTotal=0;
  if(column) 
  {
    console.log('col');
    this.filterData = this.ObjList.filter( x => x.DESCRIPTION.trim().toLowerCase().includes( column.trim().toLowerCase()));
    this.ObjList = this.filterData;
  }
}

}
