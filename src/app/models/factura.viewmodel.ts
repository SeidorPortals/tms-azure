export interface FacturaProveedor{
    MEDIUM_Name: string, //Trip #N 
    Date: string, //DELIVERY 1
    GrossAmountCurrency: string, //USD - DEFAULT
    GrossAmount: number, //SUMA DE LOS CARRIER COST
    BusinessTransactionDocumentReference: string, //Trip-N
    BuyerParty: string, //COMPANY DEL TRIP
    SellerParty: string, //CARRIER DEL TRIP 
    PODNumber: string, //CUSTOMERPO del shipment 1
    Items: FacturaItemProveedor[],
}

export interface FacturaItemProveedor{
    NetAmountCurrency: string, //USD - DEFAULT
    NetAmount: number, //AMOUNT CARRIER COST
    ProductTypeCode: number // 1 - Default
    ProductIdentifierTypeCode: number, // 1 - Default
    ProductID: string, //CATEGORY CARRIER COST
    AmountCurrency: string, // USD - Default
    Amount: string, //AMOUNT CARRIER COST
    Quantity: number,  // 1 - Default
    QuantityUnit: string, // EA - Default
    BTDITypeCode: string, // Type CATEGORY 0003 o 0002
    AccountingCodingBlockTypeCode : string,  //USERFINDETAILS = ACCASIGNMENT
    CostObjectID: string //USERFINDETAILS = COSTOBJECT
}

export interface FacturaClient{
    DocumentID: string, //TR-N-NShipment
    Name: string, //Trip #N
    ProposedInvoiceDate: string; //PICK UP 1 
    BuyerParty: string; // CUSTOMER DEL SHIPMENT
    BillFromParty: string; // COMPANY SELECTED 
    SalesUnitParty: string; // COMPANY SELECTED
    EmployeeResponsibleParty: string; //USERFINDETAILS =  BYD_EMPLOYEE
    CurrencyCode: string; //USD - DEFAULT
    PONumber: string, // CUSTOMERPO del SHIPMENT
    DeliveryDate?: string,
    Items: FacturaItemClient[];
    ExtReference: string,
  }
  
  
export interface FacturaItemClient{
    ItemID: number, //NUMBER DE 10 EN 10
    InternalID: string;  // CATEGORY CUSTOMER CHARGES
    Quantity: number; // 1 - Default
    QuantityTypeCode: string; // EA - Default
    DecimalValue: number; //AMOUNT - CUSTOMER CHARGES
    CurrencyCode: string; // USD - Default
    BaseDecimalValue: number; // 1 - Default
    BaseMeasureUnitCode: string; // EA - Default
    DeliveryDate: string, // delivery 1
    CostObjectID: string;  //USERFINDETAILS = COSTOBJECT
    AccountingCodingBlockTypeCode: string, //USERFINDETAILS = ACCASIGNMENT
  }
  
  export interface IFactura{
    items: IFacturaItem[],
    companySelected: any,
    proveedors: IFacturaItemProveedor[],
    sum: 0,
    rest: 0,
    exist: number,
    specialBill: ISpecialBillItem,
  }

  export interface ISpecialBillItem{
    client?: FacturaClient,
    proveedor?: FacturaProveedor,
    case: number,
    index: number,
  }

  export interface IFacturaItem{
    special: boolean,
    shipmentID: number,
    client: FacturaClient,
    pdf?: any,
    existDelivery: boolean,
    existPickUp: boolean,
    existCost: boolean, 
    existCharges: boolean,
  }

  export interface IFacturaItemProveedor{
    special: boolean,
    proveedor: FacturaProveedor,
    existError: boolean, 
    errorMessage: string, 
  }


  export interface ICompanyItem{
    company?: any,
    shipments?: string[],
    companyDefault: any,
  }

  export interface Proveedor{
    InternalID: string, //ID
    FirstLineName: string, //SupplierName
    SupplierIndicator: string, //true - DEFAULT
    Address: AddressProveedor[],
    Attachment: AttachmentsProveedor[], 
  }
  export interface AddressProveedor{
    CountryCode: string, //Country
    StreetName: string, //street
    HouseID: string, //housenumber
    CityName: string, //city
    RegionCode: string, //regiocode
    StreetPostalCode: string, //postalcode
  }
  export interface AttachmentsProveedor{
    Name: string,
    UUID: string,
    B64File: string, 
  }