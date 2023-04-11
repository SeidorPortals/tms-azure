import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { EquipmentTypeServiceService } from 'src/app/services/equipmentTypeService/equipment-type-service.service';

import "@ui5/webcomponents/dist/TableRow.js";
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  ObjList = [];
  @Input() name: string;
  @Input() type: string;
  @Input() list: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private ObjServiceService: EquipmentTypeServiceService

  ) {
    console.log(navParams.get('list'));
  }

  ngOnInit() {

    this.getAllData();
    console.log('on init selected');

  }
  getAllData() {
    this.ObjServiceService.getAll().subscribe(
      resp => {
        this.ObjList = resp;
        localStorage.carrier = JSON.stringify(resp);
      });
  }


  _dismiss() {

    console.log("dismiss");
    this.modalCtrl.dismiss({
      "fromModal": "This is a text"
    });
  }

  _onItemSelected(event) {

    console.log('item selected');



    //console.log("target");
    // console.log(event.target);
    console.log('item selected');
    console.log(event.srcElement.childNodes)

    if (event.srcElement.childNodes[0].innerText) {

      this.modalCtrl.dismiss({
        selectedID: event.srcElement.childNodes[0].innerText
      });

    }


  }


}
