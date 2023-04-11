import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FileModel, FileVM } from 'src/app/models/upload-attachment.viewmodel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild("uploadCollection") uploadCollection: ElementRef;

  @Output() actionGetFiles: EventEmitter<FileVM[]> = new EventEmitter();

  @Input() canEdit: boolean = true;

  @Input() files: FileVM[] = [];

  filesLength: number = 0;
  
  @Input() actualizar: boolean = false;
  @Output() actionUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(private renderer: Renderer2) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.actualizar){
      let children = this.uploadCollection.nativeElement.children;
      if(children.length > 0){
        for(let i = 0; i < children.length; i++){
          if(children[i].slot !== 'header'){
            this.renderer.removeChild(this.uploadCollection.nativeElement, children[i]);
          }
        }
      }
      
      if(this.files != null && this.files.length > 0){
        this.addAttachment();
      }
    }
  }
  ngAfterViewInit(): void {
    if(this.files != null && this.files.length > 0){
      this.addAttachment();
    }
  }


  ngOnInit(): void {
  }

  addAttachment(){
    this.files.forEach(file => {
      this.renderer.appendChild(this.uploadCollection.nativeElement,  this.createRow(file, true) );
    });

    setTimeout( () => {
      this.actionUpdate.emit(false);
    }, 500);
  }


  onChangeFile(event: any, drop: boolean = false){
    event.preventDefault();
    let file: File[] = [];
    if(drop){
      file = event.dataTransfer.files;
    }else{
      file = event.detail.files;
    }
    if(file != null && file.length > 0){
      for(let i = 0; i < file.length; i++){
        let tiposValidados: string[] = ["text/csv"];

        //validamos tipo de archivo
        if(file[i] != null && !tiposValidados.some(x => x === file[i].type)){

          if(file.length == 1){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Only CSV files and documents are allowed',
              showConfirmButton: true,
              timer: 2000,
            });
            return;
          }
          continue;
        }
    
        //validamos que no se suba el mismo archivo con el nombre
        let filesValidados: FileVM[] = [];
    
        let children = this.uploadCollection.nativeElement.children;
        if(file[i] != null && children.length > 0){
          for(let i = 0; i < children.length; i++){
            if(children[i].slot !== 'header'){
              let file = null;
              if(children[i].file != null){
                file = children[i].file;
              }
              let columns: NamedNodeMap = children[i].attributes;
              filesValidados.push({
                attachment: file,
                data64: '',
                name: columns.getNamedItem('file-name').value,
              });
            }
          }
        }
    
        if(file != null && filesValidados.length > 0 && filesValidados.some(x => x.name === file[i].name)){
          if(file.length == 1){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'We found a file with the same name, please upload a different file',
              showConfirmButton: true,
              timer: 2000,
            });
            return;
          }
          continue;
        }

        this.renderer.appendChild(this.uploadCollection.nativeElement, this.createRow(file[i]));
      }
    }
   
  }



  createRow = (event: any, exist: boolean = false) => {
    const item = this.renderer.createElement("ui5-upload-collection-item");
    console.log(event.file);
    if(exist){
      this.renderer.appendChild(item, this.createIcon());
      this.renderer.setProperty(item, "file", "");
      this.renderer.setProperty(item, "fileName", event.name);
      this.renderer.setProperty(item, "fileNameClickable", true);
      this.renderer.setAttribute(item, "data-url", event.url);
      //this.renderer.listen(item, "file-name-click", () => this.fileClick(event.url));
      this.renderer.setAttribute(item, "upload-state", "Complete");
    }else{
      this.renderer.appendChild(item, this.createIcon());
      this.renderer.setProperty(item, "file", event);
      this.renderer.setProperty(item, "fileName", event.name);
      this.renderer.setAttribute(item, "upload-state", "Ready");
      this.renderer.setAttribute(item, "progress", "0");
    }
    return item;
  }

  fileClick(event: any){
    if(event != null && event.target != null){
      let columns: NamedNodeMap = event.target.attributes;
      let url = columns.getNamedItem('data-url').value;
      window.open(url, "_blank");
    }
  }


  createIcon(){
    const icon = this.renderer.createElement("ui5-icon");
    this.renderer.setAttribute(icon, "name", "document");
    this.renderer.setAttribute(icon, "slot", "thumbnail");
    
    return icon;
  }

  async startUpload()
  {
    let files: FileVM[] = [];
    let children = this.uploadCollection.nativeElement.children
    for(let i = 0; i < children.length; i++){
      if(children[i].file != null){
        let modelo: FileVM = {
          attachment: children[i].file,
          data64: await this.getBase64(children[i].file),
        }
        files.push(modelo);
        children[i].progress = '100';
      }
    }
    //console.log(files);
    this.actionGetFiles.emit(files);
    
  }

  deleteRow(event: any){
    if(event != null && event.detail != null && event.detail.item != null){
      this.renderer.removeChild(this.uploadCollection.nativeElement, event.detail.item);
    }
  }

  async getBase64(file: any): Promise<string> {
    let codigo = "";
    let reader: FileReader = new FileReader();

    return new Promise( (resolve, reject) => {

      reader.onload = async () => {
        try{
          codigo = reader.result.toString();
          resolve(codigo);
          //console.log(codigo);
        }catch(err){
          reject('');
        }
      };
      reader.onerror = (error) => {
        reject('');
      };
      
      reader.readAsDataURL(file);
      
    });
  }

}
