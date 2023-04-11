import { Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import { IColumnTable } from 'src/app/models/list.viewmodel';
import { DeliveriesService } from 'src/app/services/deliveriesService/deliveries.service';
import { PickupsService } from 'src/app/services/pickupsService/pickups.service';
import { ShipmentService } from 'src/app/services/shipmentService/shipment.service';
import { TripService } from 'src/app/services/tripService/trip.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { UserServiceService } from 'src/app/services/userService/user-service.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
  providers: [DatePipe],
})
export class TripsComponent implements OnInit {

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

  @ViewChild('table') table: ElementRef;

  ObjList: any = [];
  ObjListOriginal: any = [];


  constructor(
    private datePipe: DatePipe, private userService: UserServiceService,
    private tripService: TripService, private shipmentService: ShipmentService,
    private deliveryService: DeliveriesService, private pickupService: PickupsService,
    public vs: ValidatorService, private toastEvoke: ToastEvokeService,
  ) { }

  ngOnInit(): void {
    //cargar los servicios secundarios antes del primero.
    if (this.userService.email.length > 0) {
      this.getList();
    }
  }

  loadSearch(event: any) {
    if (this.userService.email.length > 0) {
      if (event != null && event.target != null && event.target.highlightValue != null && event.target.highlightValue.length > 0) {
        let search: string = event.target.highlightValue;
        this.getList(search);
      } else {
        this.getList();
      }
    }

  }

  getList(campo: string = '') {
    this.ObjList = [];
    let params = { "AGENT": this.userService.email };
    this.tripService.getByOwl(params).subscribe(resp => {
      if (Array.isArray(resp)) {
        if (resp.length > 0) {
          this.ObjList = resp;
          this.ObjListOriginal = resp;
          localStorage.carriers = JSON.stringify(resp);
        } else {
          this.ObjList = [];
          this.ObjListOriginal = [];
          localStorage.removeItem('carriers');
        }
      } else {
        this.ObjList = [];
        this.ObjListOriginal = [];
        localStorage.removeItem('carriers');
        this.toastEvoke.danger(`ERROR ${resp.code}`, resp.message).subscribe();

      }
    });
  }

  // filter(campo: string){
  //   this.listPre = this.listPre.filter( item => {
  //     let itemValues: string[] = Object.values(item);
  //     let result = JSON.stringify(itemValues).toLowerCase().indexOf(campo.toLowerCase()) > -1 ? 1 : 0;
  //     return result > 0;
  //   });
  //   this.list = this.listPre;
  // }

  //// search event for search input 
  search(column: string) {
    if (column) {
      this.ObjList = this.ObjListOriginal.filter(item => {
        let itemValues: string[] = Object.values(item);
        let result = JSON.stringify(itemValues).toLowerCase().indexOf(column.toLowerCase()) > -1 ? 1 : 0;
        return result > 0;
      });
    }
  }

  confirmDelete(id: string) {
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
        let params = { "TRIPID": id };
        this.tripService.deleteBy(params).subscribe(result => {
          if (result['success']) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your trip has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1300,
            });
            this.getList();
          } else {
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }

    })
  }

}
