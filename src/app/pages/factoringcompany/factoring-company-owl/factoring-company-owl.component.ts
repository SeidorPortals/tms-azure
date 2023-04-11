import { Component, OnInit } from '@angular/core';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { IColumnTable } from 'src/app/models/list.viewmodel';
import { FactoringCompanyService } from 'src/app/services/factoringCompanyService/factoring-company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factoring-company-owl',
  templateUrl: './factoring-company-owl.component.html',
  styleUrls: ['./factoring-company-owl.component.css']
})
export class FactoringCompanyOwlComponent implements OnInit {

  listStorage: any[] = [];
  list: any[] = [];
  searchValue: string = "";

  columns: IColumnTable[] = [
    { title: 'Id', key: 'FACTORINGCOMPANYID',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'Name', key: 'NAME',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'Address', key: 'ADDRESS',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'City', key: 'CITY',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'State', key: 'STATE',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'Zip', key: 'ZIP',  type: 'TEXT', select: true, style: 'width: 8rem; ' },
    { title: 'Actions',  key: '',  type: 'TEXT', select: false, style: 'width: 8rem'},
  ];


  constructor(
    private factorincompanyService: FactoringCompanyService, private toastEvoke: ToastEvokeService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('factoringcompany');
    this.getList();
  }

  search(event: any){
    if(event != null &&  event.target != null && event.target.highlightValue != null && event.target.highlightValue.length > 0){
      this.searchValue = event.target.highlightValue;
    }else{
      this.searchValue = '';
    }
    this.getList();
  }
  

  getList(){
    this.list = [];
    this.factorincompanyService.getAll().subscribe(data => {
      if(Array.isArray(data)){
        if(data.length > 0){

          let list = [];
          data.forEach(row => {
            let modelo = {};
            this.columns.forEach(column => {
              if(row[column.key] != null){
                modelo[column.key] = row[column.key]; 
              }else{
                modelo[column.key] = ''; 
              }
            });
            list.push(modelo);
          });

          this.list = list.sort( (a,b)=> { return a['ID']-b['ID']; } );
          this.listStorage = data;
          if(this.searchValue.length > 0){
            this.filterSearch();
          }else{
            localStorage.setItem('factoringcompany', JSON.stringify(this.listStorage));
          }
        }else{
          this.list = [];
          if(localStorage.getItem('factoringcompany') != null){
            localStorage.removeItem('factoringcompany');
          }
        }
      }else{
        this.toastEvoke.danger(`ERROR ${data.code}`, data.message).subscribe();
      }
    });
  }

  filterSearch(){
    let listFilter = this.list;

    listFilter = listFilter.filter( item => {
      let itemValues: string[] = Object.values(item);
      let result = JSON.stringify(itemValues).toLowerCase().indexOf(this.searchValue.trim().toLowerCase()) > -1 ? 1 : 0;
      return result > 0;
    });
    this.list = listFilter;

    if(this.list.length > 0){
      localStorage.setItem('factoringcompany', JSON.stringify(this.listStorage));
    }else{
      if(localStorage.getItem('factoringcompany') != null){
        localStorage.removeItem('factoringcompany');
      }
    }
  }

  deleteConfirmation(id: string){
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
        let params = { "ID": id };
        this.factorincompanyService.deleteBy(params).subscribe(result => {
          if(result['success']){
            Swal.fire({
              title: 'Deleted!',
              text: 'Your work has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1300,
            });
            this.getList();
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }
    })
  }
}
