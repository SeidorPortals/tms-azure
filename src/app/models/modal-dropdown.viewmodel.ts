import { FormGroup } from "@angular/forms";

export interface IColumnModal{
    name: string;
    key: string;
    style: string;
    isID: boolean;
    isNAME: boolean;
}

export interface IItemSelectedModal{
    id: string;
    name: string;
    field: string;
    title: string;
    index: number;
    form?: FormGroup | null;
    secundary?: IComplement;
}

export interface IComplement {
    index: number;
    name: string;
    title?: string;
    columns: IColumnModal[],
}

export interface IItemSelect{
    value: string;
    text: string;
    field: string;
    selected: boolean;
}

export interface INamesList{
    name: string;
    isID: boolean;
    isNAME: boolean;
}
