export interface IColumnTable{
    title:  string;
    key: string;
    watch?: boolean;
    type: string;
    select?: boolean;
    style?: string;
    class?: string;
}

export interface IResponse{
    response: boolean;
    object: any;
}

export interface IListBasic{
    ID: string;
    NAME: string;
}

export interface IRowFactura{
    index: number,
    row: any,
    delivery: any,
    pickup: any,
    carriercost: any[],
    companySelected: any,
    customerchanges: any[], 
    total: number, 
    first: boolean,
    companyCarrier?: any[]
}
