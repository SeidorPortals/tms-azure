import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ValidatorService } from 'src/app/services/validator/validator.service';

import "@ui5/webcomponents-icons/dist/slim-arrow-left";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents/dist/MenuItem.js";
import "@ui5/webcomponents-icons/dist/upload.js";

@Component({
  selector: 'app-btn-status',
  templateUrl: './btn-status.component.html',
  styleUrls: ['./btn-status.component.css']
})
export class BtnStatusComponent implements OnInit {

  @Input() numberSelected: number = 0;
  @Input() isValidForm: boolean = false;
  @ViewChild("btnOpenBasic") btnOpen!: ElementRef;
  @ViewChild("menuBasic") menuBasic: ElementRef;

  @Output() statusSelected = new EventEmitter<number>();
  
  constructor(public vs: ValidatorService) { }

  ngOnInit(): void {
  }

  openMenu(){
    this.menuBasic.nativeElement.showAt(this.btnOpen.nativeElement);
   }


   changeStatus(code:any){
    if(code != null && code.detail != null){
      let element = code.detail.item;
      let columns: DOMStringMap = element.dataset;
      let statusNumber = columns.number.trim();
      if(statusNumber != null && statusNumber != '' && parseInt(statusNumber) != this.numberSelected){
        this.statusSelected.emit(parseInt(statusNumber));
      }
    }
    //console.log(code);
  }
}
