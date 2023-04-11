import { Component, Input, OnInit } from '@angular/core';
import { Size } from 'ngx-spinner';


export interface ISpinner {
  name: string, //nombre del spinner
  bdColor?: string, //RGB format 
  size?: Size; //small, default, medium, large
  color?: string; //css color format, default => #ffff
  type?: string; // PAGE => Load Awesome
  fullScreen?: boolean; //
}

export interface IText{
  estilo: string;
  texto: string;
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() set options(modelo: ISpinner){
    
    this._spinner.size = modelo.size != null && modelo.size.length > 0 ? modelo.size : "medium";
    this._spinner.name = modelo.name != null && modelo.name.length > 0 ? modelo.name : "principal";
    this._spinner.type = modelo.type != null && modelo.type.length > 0 ? modelo.type : "ball-scale-multiple";
    this._spinner.bdColor = modelo.bdColor != null && modelo.bdColor.length > 0 ? modelo.bdColor : "rgba(138,138,138,0.6)";
    this._spinner.fullScreen = modelo.fullScreen != null ? modelo.fullScreen : true;
    this._spinner.color = modelo.color != null && modelo.color.length > 0 ? modelo.color : "#ffff";
  
  };

  // style=""> Cargando...</p>
  @Input()  set texto(modelo: IText){
    this._texto.estilo = modelo.estilo != null && modelo.estilo.length > 0 ? modelo.estilo : "font-size: 12px; color: white";
    this._texto.texto = modelo.texto != null ? modelo.texto : "Cargando...";
  }



  private _spinner: ISpinner = {
    name: "",
  };

  private _texto: IText = {
    estilo: '',
    texto: ''
  }

  get sp(){
    return this._spinner;
  }

  get txt(){
    return this._texto;
  }

  
  constructor() { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
