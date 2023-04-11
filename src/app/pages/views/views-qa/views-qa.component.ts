import { Component,  ElementRef,  OnInit, QueryList, Renderer2, ViewChildren,  } from '@angular/core';
import { TripService } from 'src/app/services/tripService/trip.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

////UI5 Components
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab"; 
import "@ui5/webcomponents/dist/TabSeparator"; 
import "@ui5/webcomponents-icons/dist/activities.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/DatePicker";
import "@ui5/webcomponents-fiori/dist/UploadCollection.js";
import "@ui5/webcomponents-fiori/dist/UploadCollectionItem.js";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents-icons/dist/cancel.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents/dist/RadioButton";
import "@ui5/webcomponents-icons/dist/save.js";
import { ViewServiceService } from 'src/app/services/viewService/view-service.service';


interface ITableModal {
  ID: string;
  NAME: string;
  NOTES: string;
}
@Component({
  selector: 'app-views-qa',
  templateUrl: './views-qa.component.html',
  styleUrls: ['./views-qa.component.css']
})
export class ViewsQaComponent implements OnInit {
  watchAddShipment: boolean = false;

  //Suggestions
  cotainerSelected: string = '';
  listM: ITableModal[] = [];
  listSuggestionsM: string[] = [];
  @ViewChildren("containerSuggestions") containerSuggestions!: QueryList<ElementRef>;
 
  constructor(private formBuilder: FormBuilder, private renderer: Renderer2,
     private route: ActivatedRoute, private router: Router, 
     private ObjServiceService: ViewServiceService, ) { 

     }

     // "TRIPID": ['TRIP3'], //primary
  addForm: FormGroup = this.formBuilder.group({
    "VIEW_ID": ['', Validators.required],
    "VIEW_NAME": ['', Validators.required],
    "VIEW_STATUS": [true],
    "VIEW_DESCRIPTION": ['', Validators.required],
    "VIEW_ICON": ['', Validators.required],
    "VIEW_ROUTE": ['', Validators.required],
    "VIEW_TEXT": ['', Validators.required],
    "VIEW_DESCR": ['', Validators.required]
  });
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== '.!') {
      let tst = this.getByCode(id);
      this.addForm.patchValue(tst[0]);
    }

  }

  getByCode(code) {
    let data = JSON.parse(localStorage.driverData);
    //console.log(equiptype);
    return data.filter(
      function (data) { return data.VIEW_ID == code }
    );
  }

  validarcampos(campo: string) {
    return this.addForm.controls[campo].errors && this.addForm.controls[campo].touched;
  }

  createObj(closeScreen: boolean) {
    
    this.ObjServiceService.CreateObj(this.addForm.value).subscribe(data => {
      console.log(data, "created!");
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1300
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
          this.router.navigate(['/views']);
          localStorage.clear();
        }
      });
    }
    )
    //console.log(this.addEquipmentForm.value);
  }

  actionsave(addForm, closeScreen: boolean) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== '.!') {
      let tst = this.getByCode(id);

      try {
        this.ObjServiceService.EditObj(addForm.value).subscribe(data => {
          console.log(data);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1300
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer && closeScreen == true) {
              this.router.navigate(['/views']);
              localStorage.clear();
            }
          })
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Review your entries',
          text: error,
          timer: 1500,
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            //this.router.navigate(['/equipmenttypes']);
          }
        });
      }
    }
    else {
      this.createObj(closeScreen);
    }
  }

  addTextArea(campo: string, event: any){
    if(event != null && event.explicitOriginalTarget != null && event.explicitOriginalTarget.value != null){
      this.addForm.get(campo).setValue(event.explicitOriginalTarget.value);
    }
  }

  actionWatchShipment(valor: boolean){
    //console.log(this.addForm.value);
    this.watchAddShipment = valor;
  }

  //Modal
  changeField(event: string, field: string){
    this.addForm.get(field).setValue(event.trim());
  }

  //suggestions

 




  



 

}
