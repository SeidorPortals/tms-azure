import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { FileModel, FileVM , Attachment} from 'src/app/models/upload-attachment.viewmodel';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.css']
})
export class UploadAttachmentsComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild("uploadCollection") uploadCollection: ElementRef;

  @Input() canEdit: boolean = true;

  @Input() files: FileVM[] = [];


  @Input() objectID: string = '';
  @Input() type: string = '';
  @Input() service: any = null; 

  @Output() actionGetFiles: EventEmitter<FileVM[]> = new EventEmitter();

  
  Attahcment: Attachment[] = [];

  constructor(private renderer: Renderer2, private toastEvoke: ToastEvokeService, private vs: ValidatorService) { }
  ngOnChanges(changes: SimpleChanges): void {
    // if(this.actualizar){
    //   let children = this.uploadCollection.nativeElement.children;
    //   if(children.length > 0){
    //     for(let i = 0; i < children.length; i++){
    //       if(children[i].slot !== 'header'){
    //         this.renderer.removeChild(this.uploadCollection.nativeElement, children[i]);
    //       }
    //     }
    //   }
      
    //   if(this.files != null && this.files.length > 0){
    //     this.addAttachment();
    //   }
    // }
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
    localStorage.setItem("CarrAtta", JSON.stringify(this.Attahcment));
    console.log(JSON.parse(localStorage.getItem("CarrAtta")))
    // setTimeout( () => {
    //   this.actionUpdate.emit(false);
    // }, 500);
  }


  onChangeFile(event: any, drop: boolean = false){
    event.preventDefault();
    
    let type = this.vs.getTypeAttachmentByCode(parseInt(this.type));
    if(this.objectID === null || this.objectID.length === 0){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: `Create the ${type} first and try again`,
        showConfirmButton: true,
        timer: 2000,
      });
      return;
    }

    let file: File[] = [];
    if(drop){
      file = event.dataTransfer.files;
    }else{
      file = event.detail.files;
    }
    if(file != null && file.length > 0)
    {
      for(let i = 0; i < file.length; i++)
      {
        let tiposValidados: string[] = ["application/vnd.rar","application/x-rar-compressed","application/zip","application/x-zip-compressed",
          "image/png","image/jpeg","image/gif", "application/pdf", "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      
        //validamos tipo de archivo
        if(file[i] != null && !tiposValidados.some(x => x === file[i].type)){

          if(file.length == 1){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Only .png, .jpg, .jpeg, .gif, .pdf, .docx, .doc, .rar, .zip extensions are allowed',
              showConfirmButton: true,
              timer: 2000,
            });
            return;
          }
          continue;
        }
        
        //validamos el peso
        if(file[i].size > 3000000){
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'The attachment cannot exceed 3Mb',
            showConfirmButton: true,
            timer: 2000,
          });
          return;
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
              //console.log(columns.getNamedItem('file-name').value);
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



  createRow = (event: any, exist: boolean = false) => 
  {
    const item = this.renderer.createElement("ui5-upload-collection-item");
    if(exist){
      this.renderer.appendChild(item, this.createIcon());
      this.renderer.setProperty(item, "file", "");
      this.renderer.setProperty(item, "fileName", event.name);
      this.renderer.setProperty(item, "fileNameClickable", true);
      this.renderer.setAttribute(item, "data-url", event.url);
      this.renderer.setAttribute(item, "upload-state", "Complete");
      this.renderer.setAttribute(item, "UUID", event.UUID);

      //cargar en localstorage el registro de attachament
      this.Attahcment.push({
        UUID: event.UUID,
        name: event.name,
        url: event.url,
        saved: false,
        sync: event.sync        
      });
      
    }else{
      this.renderer.appendChild(item, this.createIcon());
      this.renderer.setProperty(item, "file", event);
      this.renderer.setProperty(item, "fileName", event.name);
      this.renderer.setAttribute(item, "upload-state", "Ready");
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

  startUpload(){
    let type = this.vs.getTypeAttachmentByCode(parseInt(this.type));
    
    if(this.type == '9')
    {
      //console.log(this.type);
      this.returnFiles();
    }
    else
    {
      if(this.objectID === null || this.objectID.length === 0){
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `Create the ${type} first and try again`,
          showConfirmButton: true,
          timer: 2000,
        });
        return;
      }
  
      this.canEdit = false;
      let files: FileVM[] = [];
      let children = this.uploadCollection.nativeElement.children;
      if(children != null && children.length > 0){
        for(let i = 0; i < children.length; i++){
          if(children[i].file != null){
            let modelo: FileVM = {
              attachment: children[i].file,
              data64: '',
            }
            files.push(modelo);
          }
        }
        this.sendFiles(files);
      }else{
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `No files added`,
          showConfirmButton: true,
          timer: 2000,
        });
        return;
      }
    }
  }

  sendFiles(files: FileVM[], index: number = 0){
    if(files != null && files.length > 0 && index < files.length){
      this.sendFile(files,files[index], index);
    }else{
      this.toastEvoke.success(``, `FINISH UPLOAD ATTACHMENTS`).subscribe();
      this.canEdit = true;
    }
  }
  
  sendFile(files: FileVM[], file: FileVM, index: number){
    let responseAttachment: FileVM = {
      attachment: file.attachment,
      data64: ''
    };
    let modelo = {
      fileRaw: file.attachment,
      fileName: file.attachment.name,
      ID: this.objectID,
    };
    this.service.CreateAttachments(modelo).subscribe(result => {
      index++;
      if(result['success']){
        this.toastEvoke.success(`CREATED`, `${modelo.fileName} CREATED`).subscribe();

        responseAttachment.name = result.helper != null ? result.helper['name'] : '';
        responseAttachment.url = result.helper != null ? result.helper['url'] : '';

      }else{
        this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
        responseAttachment.name = '';
        responseAttachment.url = '';
      }

      //validamos respuesta
      let children = this.uploadCollection.nativeElement.children;
      let childrenSelected: any = null;
      for(let i = 0; i < children.length; i++){
        if(children[i].slot !== 'header'){
          let columns: NamedNodeMap = children[i].attributes;
          let nameFile = columns.getNamedItem('file-name').value;
          if(nameFile === file.attachment.name){
            childrenSelected = children[i];
          }
        }
      }
      
      if(responseAttachment.name != ''){ //significa que se subio correctamente
        this.renderer.setProperty(childrenSelected, "file", "");
        this.renderer.setProperty(childrenSelected, "fileName", file.attachment.name);
        this.renderer.setProperty(childrenSelected, "fileNameClickable", true);
        this.renderer.setAttribute(childrenSelected, "data-url", responseAttachment.url);
        this.renderer.setAttribute(childrenSelected, "upload-state", "Complete");
        this.renderer.setAttribute(childrenSelected, "UUID", responseAttachment.name);
        
        console.log(responseAttachment.url);
        //cargar en localstorage el registro de attachament
        this.Attahcment.push({
          UUID: responseAttachment.name,
          name: file.attachment.name,
          url: responseAttachment.url,
          saved: false,
          sync: false        
        });

        //// actualizar el local storage
        localStorage.setItem("CarrAtta", JSON.stringify(this.Attahcment));
        console.log(JSON.parse(localStorage.getItem("CarrAtta")));

      }else{
        this.renderer.setAttribute(childrenSelected, "upload-state", "Error");
      }

      this.sendFiles(files,index);

    });
  }

  deleteRow(event: any){
    if(event != null && event.detail != null && event.detail.item != null){
      let child = event.detail.item;
      if(child.file != null){
        this.renderer.removeChild(this.uploadCollection.nativeElement, child);
      }else{
        let columns: NamedNodeMap = event.detail.item.attributes;
        let UUIDFile = columns.getNamedItem('UUID').value;
        let nameFile = columns.getNamedItem('file-name').value;
        
        this.service.deleteAttachment(UUIDFile,this.objectID, this.type).subscribe(result => {
          if(result['success']){
            this.toastEvoke.success(`DELETED`, `${nameFile} DELETED`).subscribe();
            this.renderer.removeChild(this.uploadCollection.nativeElement, child);
            
            //// actualizar el local storage
            this.Attahcment.forEach((value,index)=>
              {
                if(value.UUID==UUIDFile) 
                  this.Attahcment.splice(index,1);
              }
            );
            localStorage.setItem("CarrAtta", JSON.stringify(this.Attahcment));
            console.log(JSON.parse(localStorage.getItem("CarrAtta")));
            
          }else{
            this.toastEvoke.danger(`ERROR ${result.code}`, result.message).subscribe();
          }
        });
      }
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

  ///envia los archivos para trabajarlos en el componente padre
  async returnFiles()
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

}
