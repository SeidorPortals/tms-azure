export class comodityModel {
    mc :  Number;
	name  : string ;
	adress  : string;
	city  : string;
	state : string;
	zipcode : string;
	phone : string;
	mobilephone : string;
	country : string ;
	contact : string;
	salesman : string;
	factoringcompany : string;        
	term : string;
	statusid : Number ;
	accoutingemail : string;
	notificationemail : string;
	notes :string ;
	createdby : string;
	createdon : string;
	changeby : string;
	changeon : string;
  }

  export interface Customer{
    InternalID: string, //ID
    CategoryCode: string,
    FirstLineName: string, //Customer
    Address: AddressCustomer[],
    Attachment: AttachmentsCustomer[], 
  }
  export interface AddressCustomer{
    DefaultIndicator: string, //Country
    CountryCode: string, //Country
    StreetName: string, //street
    HouseID: string, //housenumber
    CityName: string, //city
    RegionCode: string, //regiocode
    StreetPostalCode: string, //postalcode
  }
  export interface AttachmentsCustomer{
    Name: string
    B64File: string, 
  }