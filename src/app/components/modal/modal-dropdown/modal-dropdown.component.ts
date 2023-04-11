import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IColumnModal, IItemSelectedModal } from 'src/app/models/modal-dropdown.viewmodel';
@Component({
  selector: 'app-modal-dropdown',
  templateUrl: './modal-dropdown.component.html',
  styleUrls: ['./modal-dropdown.component.css']
})
export class ModalDropdownComponent implements OnInit, OnChanges {

  //form
  @Input() ovsSelected: IItemSelectedModal = {
    id: '',
    name: '',
    field: '',
    title: '',
    form: null,
    index: 0,
  };

  @Input() watchOVS: boolean = false;

  //variable que nos permite obtener el valor del campo para el buscador.
  @Input() fieldSearch: string = '';

  //lista 
  @Input() list: any = [];
  @Input() listFilter: any = [];

  //columnas
  @Input() columns: IColumnModal[] = [];
 
  //
  @Output() fieldSelected: EventEmitter<IItemSelectedModal> = new EventEmitter(); 
  @Output() actionClose: EventEmitter<boolean> = new EventEmitter();
  @Output() actionUpdateInfo: EventEmitter<number> = new EventEmitter();

  //Manejar el modal
  @ViewChild('modalDropdown') modalDropdown!: ElementRef;

  constructor( ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.watchOVS){
      this.openModalDropdown();
    }
    //console.log(this.list);
  }

  ngOnInit(): void {
  }

    //Modal
    openModalDropdown() {
      //console.log(this.fieldSearch);
      this.modalDropdown.nativeElement.show();

     // this.actionUpdateInfo.emit(this.title);
      if(this.list.length > 0 && this.fieldSearch != null && this.fieldSearch.length > 0){
        this.filterList();
        //this.updateList = false;
      }else{
        this.listFilter = this.list;
      }
    }
  
    closeModalDropdown(){
      this.watchOVS = false;
      //this.fieldSearch = '';
      this.actionClose.emit(false);
      this.modalDropdown.nativeElement.close();
    }
  
    changeSearchInput(event: any){
      //console.log(event);
      if(event != null && event.target != null && event.target.highlightValue != null){
        this.fieldSearch = event.target.highlightValue;
      }
    }

    filterSearch(){
      this.list = [];
      this.listFilter = [];
      this.actionUpdateInfo.emit(this.ovsSelected.index);

      if(this.list.length > 0 && this.fieldSearch != null && this.fieldSearch.length > 0){
        this.filterList();
      }else{
        this.listFilter = this.list;
      }
    }

    filterList(){  
      this.listFilter = this.list
      .filter( (item: any) => {
      let itemValues: string[] = Object.values(item);
      let prueba = JSON.stringify(itemValues).toLowerCase().indexOf(this.fieldSearch.toLowerCase()) > -1 ? 1 : 0;
      return prueba > 0;
      });
    }
  
    selectItemModalDropdown(event: any){
      if(event != null && event.detail != null && event.detail.selectedRows != null && event.detail.selectedRows.length > 0){
        let hijos: any = event.detail.selectedRows[0].children;

        let model: IItemSelectedModal = {
          id: '',
          name: '',
          field: this.ovsSelected.field,
          title: '',
          index: this.ovsSelected.index,
        };
        //console.log(hijos);
        for(let i = 0; i< hijos.length; i++){
          let columnRow: DOMStringMap = hijos[i].dataset;
            this.columns.forEach(column => {
              if(column.name === columnRow.column && column.isID){
                model.id = hijos[i].innerText;
              }

              if(column.name === columnRow.column && column.isNAME){
                model.name = hijos[i].innerText;
              }
            });
        }
        this.fieldSearch = '';
        this.fieldSelected.emit(model);
        this.closeModalDropdown();
      }
    }
    
}
