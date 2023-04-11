export interface FileVM{
    UUID?: string,
    attachment: File;
    data64: string;
    name?: string,
    url?: string,
    sync?: boolean
}

export interface FileModel{
    name: string,
    url: string,
}

//interface truck brokers
export interface ITruckBrokers{
    phone: string,
    fax: string,
    trip: string,
    pickUpRate: string,
    equipmenttype: string,
    carrier: string,
    deliveryDate: string,
    transportType: string,
    dispatcherphone1: string,
    truck: string,
    driver: string,
    temperature: string,
    trailer: string,
    pickUp?: IPickUpVM,
    delivery?: IDeliveryVM,
    carriers?: ICarrierCostVM[],
    totalPay: string,
    customer: string,
    carrierSelected?: ICarrierVM,
}

export interface IPickUpVM{
    address1: string,
    address2: string,
    city: string,
    zipcode: string,
    phone: string,
    commodity: string,
    pickUpDate: string,
    pickUpTime: string,
    pickUpRef: string,
    contact: string,
    pcsweight: string,
    notes: string,
    seal: string,
}

export interface IDeliveryVM{
    address1: string,
    address2: string,
    city: string,
    zipcode: string,
    phone: string,
    deliveryDate: string,
    deliveryTime: string,
    deliveryRef: string,
    contact: string,
    pcsweight: string,
    notes: string,
}

export interface ICarrierCostVM{
    service: string,
    notes: string, 
    payment: string,
}

export interface ICarrierVM{
    carrier: string,
    mc: string,
    address: string,
    city: string,
    phone: string, 
    fax: string, 
    contact: string,
}

export interface Attachment{
    UUID?: string,
    name: string,
    url: string,
    saved: boolean,
    sync: boolean
}