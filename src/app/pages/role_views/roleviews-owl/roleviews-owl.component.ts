import { Component, OnInit, HostListener } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleviewServicesService } from 'src/app/services/roleviewServices/roleview-services.service';

@Component({
  selector: 'app-roleviews-owl',
  templateUrl: './roleviews-owl.component.html',
  styleUrls: ['./roleviews-owl.component.css']
})
export class RoleviewsOwlComponent implements OnInit {

  
  ObjList = [];
  
  constructor(
    private ObjServiceService: RoleviewServicesService,
  ) { }

  ngOnInit(): void {
    this.getAllData()
  }



  getAllData() {
    this.ObjServiceService.getAll().subscribe(
      resp => {
        this.ObjList = resp;

        localStorage.trucks = JSON.stringify(resp);
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

    var value = "{\"ROLEVIEW_ID\": " + eqid + "}";
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
          //console.log(data, "Deleted!");
          swalWithBootstrapButtons.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllData();
        })


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        // swalWithBootstrapButtons.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })
  }

}
