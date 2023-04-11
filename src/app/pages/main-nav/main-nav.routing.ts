import { Routes } from '@angular/router';
import { CarriersComponent } from '../carriers/carriers-owl/carriers.component';
import { CreateDriverComponent } from '../drivers/driver-qa/create-driver.component';
import { DriversComponent } from '../drivers/driver-owl/drivers.component';
import { TrucksComponent } from '../trucks/trucks-owl/trucks.component';
import { ConsigneeOWLComponent } from '../consignee/consignee-owl/consignee-owl.component';
import { ConsigneeQAComponent } from '../consignee/consignee-qa/consignee-qa.component';
import { CreateComodityComponent } from '../commodity/commodity-qa/create-comodity.component';
import { CreateShipmentComponent } from '../trip/shipments/shipment-qa/create-shipment.component';
import { CreateTrailerComponent } from '../trailer/trailer-qa/create-trailer.component';
import { CreateTripComponent } from '../trip/trip-qa/create-trip.component';
import { CreateTrucksComponent } from '../trucks/trucks-qa/create-trucks.component';
import { TruckownerComponent } from '../truckowner/truckowner-owl/truckowner.component';
import { ShipperOWLComponent } from '../shipper/shipper-owl/shipper-owl.component';
import { ShipperQAComponent } from '../shipper/shipper-qa/shipper-qa.component';
import { CreateCarriersComponent } from '../carriers/carriers-qa/create-carriers.component';
import { TripsComponent } from '../trip/trip-owl/trips/trips.component';
import { CreateCustomerComponent } from '../customer/customer-qa/create-customer.component';

import { CustomersComponent } from '../customer/customer-owl/customers.component';
import { ComoditiesComponent } from '../commodity/commodity-owl/comodities.component';
import { TrailerOwlComponent } from '../trailer/trailer-owl/trailer-owl.component';
import { CreateTruckownerComponent } from '../truckowner/truckowner-qa/create-truckowner.component';
import { HomeComponent } from '../home/home.component';
import { EquipmentTypeConfigOWLComponent } from '../equipmentType-config/equipment-type-config-owl/equipment-type-config-owl.component';
import { EquipmentTypeConfigQAComponent } from '../equipmentType-config/equipment-type-config-qa/equipment-type-config-qa.component';

import { RolesOwlComponent } from '../roles/roles-owl/roles-owl.component';
import { RolesQaComponent } from '../roles/roles-qa/roles-qa.component';
import { UserOwlComponent } from '../user/user-owl/user-owl.component';
import { UserQaComponent } from '../user/user-qa/user-qa.component';
import { RoleviewsOwlComponent } from '../role_views/roleviews-owl/roleviews-owl.component';
import { RoleviewsQaComponent } from '../role_views/roleviews-qa/roleviews-qa.component';
import { ViewsOwlComponent } from '../views/views-owl/views-owl.component';
import { ViewsQaComponent } from '../views/views-qa/views-qa.component';

import { InsuranceCompanyQaComponent } from '../insuranceCompany/insurance-company-qa/insurance-company-qa.component';
import { PaybasisOwlComponent } from '../paybasis/paybasis-owl/paybasis-owl.component';
import { DriverTypeOwlComponent } from '../driverType/driver-type-owl/driver-type-owl.component';
import { DriverTypeQaComponent } from '../driverType/driver-type-qa/driver-type-qa.component';
import { InsuranceCompanyOwlComponent } from '../insuranceCompany/insurance-company-owl/insurance-company-owl.component';
import { PaybasisQaComponent } from '../paybasis/paybasis-qa/paybasis-qa.component';
import { TrailerTypeOwlComponent } from '../trailerType/trailer-type-owl/trailer-type-owl.component';
import { TrailerTypeQaComponent } from '../trailerType/trailer-type-qa/trailer-type-qa.component';
import { TransporttypeComponent } from '../transporttype/transporttype-owl/transporttype.component';
import { TransporttypeQaComponent } from '../transporttype/transporttype-qa/transporttype-qa.component';
import { RooftypeOwlComponent } from '../rooftype/rooftype-owl/rooftype-owl.component';
import { RooftypeQaComponent } from '../rooftype/rooftype-qa/rooftype-qa.component';
import { PaytypeOwlComponent } from '../paytype/paytype-owl/paytype-owl.component';
import { PaytypeQaComponent } from '../paytype/paytype-qa/paytype-qa.component';
import { ScrowtypeOwlComponent } from '../scrowtype/scrowtype-owl/scrowtype-owl.component';
import { ScrowtypeQaComponent } from '../scrowtype/scrowtype-qa/scrowtype-qa.component';
import { LoginComponent } from '../login/login/login.component';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { FactoringCompanyOwlComponent } from '../factoringcompany/factoring-company-owl/factoring-company-owl.component';
import { FactoringCompanyQaComponent } from '../factoringcompany/factoring-company-qa/factoring-company-qa.component';

import { UploaderComponent } from '../uploader/uploader/uploader.component';
import { UploaderOwlComponent } from '../uploader/uploader-owl/uploader-owl.component';




export const AdminLayoutRoutes: Routes = [
    { path: 'home',      component: HomeComponent },
    
    //////TRIPS
    { path: 'trips',    component: TripsComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-trip/:id',    component: CreateTripComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },

    /////MASTER DATA
    {  path: 'carriers', component: CarriersComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path:'new-carrier/:id', component:CreateCarriersComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },

    { path: 'drivers',       component: DriversComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-driver/:id',    component: CreateDriverComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    
    { path: 'truckowners',    component: TruckownerComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-truckowner/:id', component: CreateTruckownerComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },

    //////VEHICLES
    { path: 'trucks',    component: TrucksComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-truck/:id',    component: CreateTrucksComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },

    { path: 'trailers', component: TrailerOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-trailer/:id',    component: CreateTrailerComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    
    ///////
    { path: 'consignees',    component: ConsigneeOWLComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-consignee/:id',    component: ConsigneeQAComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'commodity',    component: ComoditiesComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-comodity/:id',    component: CreateComodityComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'shippers',    component: ShipperOWLComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-shipper/:id',    component: ShipperQAComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    
    { path: 'new-shipment',    component: CreateShipmentComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'customers',    component: CustomersComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-customer/:id',    component: CreateCustomerComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    
    { path: 'equipmenttypes', component: EquipmentTypeConfigOWLComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-equipmenttype/:id', component: EquipmentTypeConfigQAComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },


    { path: 'roles', component:RolesOwlComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['DISPATCHER'] } } },
    {path: 'new-role/:id', component:RolesQaComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    {path: 'users', component:UserOwlComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    {path: 'new-user/:id', component:UserQaComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    {path: 'roleviews', component:RoleviewsOwlComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    {path: 'new-roleview/:id', component:RoleviewsQaComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    {path: 'views', component:ViewsOwlComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    {path: 'new-view/:id', component:ViewsQaComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'drivertype', component: DriverTypeOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-drivertype/:id', component: DriverTypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'trailertype', component: TrailerTypeOwlComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-trailertype/:id', component: TrailerTypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'insuranceCompany', component: InsuranceCompanyOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-insuranceCompany/:id', component: InsuranceCompanyQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'paybasis', component: PaybasisOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-paybasis/:id', component: PaybasisQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'transporttype', component: TransporttypeComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-transporttype/:id', component: TransporttypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'rooftype', component: RooftypeOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-rooftype/:id', component: RooftypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },    

    { path: 'paymenttype', component: PaytypeOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-paymenttype/:id', component: PaytypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    
    { path: 'factoringcompany', component: FactoringCompanyOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-factoringcompany/:id', component: FactoringCompanyQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    { path: 'scrowtype', component: ScrowtypeOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },
    { path: 'new-scrowtype/:id', component: ScrowtypeQaComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN'], except: ['GUEST'] } } },

    //////UPLOAD
    { path: 'uploader',    component: UploaderOwlComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    { path: 'new-uploader/:id',    component: UploaderComponent , canActivate: [NgxPermissionsGuard], data: { permissions: { only: ['ADMIN','DISPATCHER'], except: ['GUEST'] } } },
    
];
