import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import '@ui5/webcomponents/dist/Button';
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents-fiori/dist/Bar.js";
import '@ui5/webcomponents-fiori/dist/ShellBar';
import '@ui5/webcomponents/dist/Title';
import '@ui5/webcomponents/dist/Input';
import '@ui5/webcomponents/dist/DatePicker';
import '@ui5/webcomponents/dist/List';
import '@ui5/webcomponents/dist/CustomListItem';
import '@ui5/webcomponents/dist/Panel'; 
import '@ui5/webcomponents/dist/Dialog';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/TextArea';
import '@ui5/webcomponents/dist/StandardListItem';
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents-fiori/dist/SideNavigation.js";
import "@ui5/webcomponents-fiori/dist/SideNavigationItem.js";
import "@ui5/webcomponents-fiori/dist/SideNavigationSubItem.js";
import "@ui5/webcomponents-icons/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/ProductSwitch.js";
import "@ui5/webcomponents-fiori/dist/ProductSwitchItem.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents/dist/CustomListItem.js";
import "@ui5/webcomponents/dist/GroupHeaderListItem.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents/dist/Table.js";
import "@ui5/webcomponents/dist/TableColumn.js";
import "@ui5/webcomponents/dist/TableRow.js";
import "@ui5/webcomponents/dist/TableCell.js";
import "@ui5/webcomponents/dist/Title";
import "@ui5/webcomponents/dist/FileUploader.js";
import "@ui5/webcomponents/dist/CheckBox";
import "@ui5/webcomponents/dist/Card";
import "@ui5/webcomponents/dist/ComboBox";
import "@ui5/webcomponents/dist/Badge";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents-fiori/dist/ShellBarItem";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/excel-attachment.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/menu2.js";
import "@ui5/webcomponents-icons/dist/trip-report.js";
import "@ui5/webcomponents-icons/dist/account.js";
import "@ui5/webcomponents-icons/dist/filter-fields.js";
import "@ui5/webcomponents-icons/dist/geographic-bubble-chart.js";
import "@ui5/webcomponents-base/dist/features/F6Navigation.js";
import "@ui5/webcomponents-icons/dist/action-settings.js";
import "@ui5/webcomponents-icons/dist/user-settings.js";
import "@ui5/webcomponents-icons/dist/nav-back.js";
import "@ui5/webcomponents-icons/dist/log.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/complete.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-fiori/dist/DynamicSideContent";
import "@ui5/webcomponents/dist/TextArea";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import { CarriersComponent } from './pages/carriers/carriers-owl/carriers.component';
import { MainNavComponent } from './pages/main-nav/main-nav.component';
import { CreateCarriersComponent } from './pages/carriers/carriers-qa/create-carriers.component';
import { EquipmentTypeConfigOWLComponent } from './pages/equipmentType-config/equipment-type-config-owl/equipment-type-config-owl.component';
import { EquipmentTypeConfigQAComponent } from './pages/equipmentType-config/equipment-type-config-qa/equipment-type-config-qa.component';
import { CreateTripComponent } from './pages/trip/trip-qa/create-trip.component';
import { CreateShipmentComponent } from './pages/trip/shipments/shipment-qa/create-shipment.component';
import { CreateTrailerComponent } from './pages/trailer/trailer-qa/create-trailer.component';
import { ShipperQAComponent } from './pages/shipper/shipper-qa/shipper-qa.component';
import { ShipperOWLComponent } from './pages/shipper/shipper-owl/shipper-owl.component';
import { ConsigneeQAComponent } from './pages/consignee/consignee-qa/consignee-qa.component';
import { ConsigneeOWLComponent } from './pages/consignee/consignee-owl/consignee-owl.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateCustomerComponent } from './pages/customer/customer-qa/create-customer.component';
import { CreateComodityComponent } from './pages/commodity/commodity-qa/create-comodity.component';
import { DriversComponent } from './pages/drivers/driver-owl/drivers.component';
import { CreateDriverComponent } from './pages/drivers/driver-qa/create-driver.component';
import { TrucksComponent } from './pages/trucks/trucks-owl/trucks.component';
import { CreateTrucksComponent } from './pages/trucks/trucks-qa/create-trucks.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TripsComponent } from './pages/trip/trip-owl/trips/trips.component';
import { TruckownerComponent } from './pages/truckowner/truckowner-owl/truckowner.component';
import { CreateTruckownerComponent } from './pages/truckowner/truckowner-qa/create-truckowner.component';
import { CustomersComponent } from './pages/customer/customer-owl/customers.component';
import { ComoditiesComponent } from './pages/commodity/commodity-owl/comodities.component';
import { TrailerOwlComponent } from './pages/trailer/trailer-owl/trailer-owl.component';
import { ShellbarComponent } from './shared/shellbar/shellbar.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { HomeComponent } from './pages/home/home.component';
import { RolesOwlComponent } from './pages/roles/roles-owl/roles-owl.component';
import { RolesQaComponent } from './pages/roles/roles-qa/roles-qa.component';
import { UserQaComponent } from './pages/user/user-qa/user-qa.component';
import { UserOwlComponent } from './pages/user/user-owl/user-owl.component';
import { RoleviewsQaComponent } from './pages/role_views/roleviews-qa/roleviews-qa.component';
import { ViewsQaComponent } from './pages/views/views-qa/views-qa.component';
import { ViewsOwlComponent } from './pages/views/views-owl/views-owl.component';
import { RoleviewsOwlComponent } from './pages/role_views/roleviews-owl/roleviews-owl.component';
import { DriverTypeQaComponent } from './pages/driverType/driver-type-qa/driver-type-qa.component';
import { DriverTypeOwlComponent } from './pages/driverType/driver-type-owl/driver-type-owl.component';
import { InsuranceCompanyQaComponent } from './pages/insuranceCompany/insurance-company-qa/insurance-company-qa.component';
import { InsuranceCompanyOwlComponent } from './pages/insuranceCompany/insurance-company-owl/insurance-company-owl.component';
import { PaybasisQaComponent } from './pages/paybasis/paybasis-qa/paybasis-qa.component';
import { PaybasisOwlComponent } from './pages/paybasis/paybasis-owl/paybasis-owl.component';
import { TrailerTypeQaComponent } from './pages/trailerType/trailer-type-qa/trailer-type-qa.component';
import { TrailerTypeOwlComponent } from './pages/trailerType/trailer-type-owl/trailer-type-owl.component';
import { ModalComponent } from './components/modal/modal/modal.component';
import { ComponentsModule } from './components/component.module';
import { ModalDropdownComponent } from './components/modal/modal-dropdown/modal-dropdown.component';
import { TransporttypeComponent } from './pages/transporttype/transporttype-owl/transporttype.component';
import { TransporttypeQaComponent } from './pages/transporttype/transporttype-qa/transporttype-qa.component';
import { ScrowtypeOwlComponent } from './pages/scrowtype/scrowtype-owl/scrowtype-owl.component';
import { ScrowtypeQaComponent } from './pages/scrowtype/scrowtype-qa/scrowtype-qa.component';
import { RooftypeOwlComponent } from './pages/rooftype/rooftype-owl/rooftype-owl.component';
import { RooftypeQaComponent } from './pages/rooftype/rooftype-qa/rooftype-qa.component';
import { PaytypeOwlComponent } from './pages/paytype/paytype-owl/paytype-owl.component';
import { PaytypeQaComponent } from './pages/paytype/paytype-qa/paytype-qa.component';
import { UploadAttachmentsComponent } from './components/attachments/upload-attachments/upload-attachments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateRateConfirmationComponent } from './components/template/template-rate-confirmation/template-rate-confirmation.component';
import { LoginComponent } from './pages/login/login/login.component';
import { SessionModalComponent } from './components/modal/session/session-modal/session-modal.component';
import { BtnStatusComponent } from './components/btn/btn-status/btn-status.component';
//NG-ZORRO
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
registerLocaleData(en);


/////Permissions
import { LoadService } from './services/loadRole/load.service';
import { APP_INITIALIZER } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

///Timeout
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { SearchemailComponent } from './pages/resetpassword/searchemail/searchemail.component';
import { UpdatepasswordComponent } from './pages/resetpassword/updatepassword/updatepassword.component';
import { ToastrModule } from 'ngx-toastr';
import { FactoringCompanyOwlComponent } from './pages/factoringcompany/factoring-company-owl/factoring-company-owl.component';
import { FactoringCompanyQaComponent } from './pages/factoringcompany/factoring-company-qa/factoring-company-qa.component';
import { AppearanceAnimation, DisappearanceAnimation, 
  NgxAwesomePopupModule, ToastNotificationConfigModule, 
  ToastPositionEnum, 
  ToastProgressBarEnum, ToastUserViewTypeEnum } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingComponent } from './components/btn/loading/loading.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UploaderComponent } from './pages/uploader/uploader/uploader.component';
import { UploaderOwlComponent } from './pages/uploader/uploader-owl/uploader-owl.component';
import { UploadCsvComponent } from './components/attachments/upload-csv/upload-csv.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';





export function servicesOnRun(config: LoadService) {
  return () => config.getRoles().then((result) => console.log(result));
}


@NgModule({
  declarations: [
    AppComponent,
    CarriersComponent,
    MainNavComponent,
    CreateCarriersComponent,
    EquipmentTypeConfigQAComponent,
    EquipmentTypeConfigOWLComponent,
    CreateTripComponent,
    CreateShipmentComponent,
    CreateTrailerComponent,
    ShipperQAComponent,
    ShipperOWLComponent,
    ConsigneeQAComponent,
    ConsigneeOWLComponent,
    CreateCustomerComponent,
    CreateComodityComponent,
    DriversComponent,
    CreateDriverComponent,
    TrucksComponent,
    CreateTrucksComponent,
    TruckownerComponent,
    CreateTruckownerComponent,
    TripsComponent,
    CustomersComponent,
    ComoditiesComponent,
    TrailerOwlComponent,
    ShellbarComponent,
    SidenavComponent,
    HomeComponent,
    RolesOwlComponent,
    RolesQaComponent,
    UserQaComponent,
    UserOwlComponent,
    RoleviewsQaComponent,
    ViewsQaComponent,
    ViewsOwlComponent,
    RoleviewsOwlComponent,
    DriverTypeQaComponent,
    DriverTypeOwlComponent,
    InsuranceCompanyQaComponent,
    InsuranceCompanyOwlComponent,
    PaybasisQaComponent,
    PaybasisOwlComponent,
    TrailerTypeQaComponent,
    TrailerTypeOwlComponent,
    ModalComponent,
    ModalDropdownComponent,
    SessionModalComponent,
    TransporttypeComponent,
    TransporttypeQaComponent,
    ScrowtypeOwlComponent,
    ScrowtypeQaComponent,
    RooftypeOwlComponent,
    RooftypeQaComponent,
    PaytypeOwlComponent,
    PaytypeQaComponent,
    UploadAttachmentsComponent,
    LoginComponent,
    TemplateRateConfirmationComponent,
    SearchemailComponent,
    UpdatepasswordComponent,
    BtnStatusComponent,
    LoadingComponent,
    FactoringCompanyOwlComponent,
    FactoringCompanyQaComponent,
    UploaderComponent,
    UploaderOwlComponent,
    UploadCsvComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    ComponentsModule,
    FormsModule,
    BrowserAnimationsModule,
    NzAutocompleteModule,
    NzInputModule,
    NzSpinModule,
    NzIconModule,
    NzSelectModule,
    NgxSpinnerModule,
    NgxPermissionsModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 2600,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxAwesomePopupModule.forRoot({
      colorList: {
        success: '#56d37b', // optional
        info: '#2e7cc4', // optional
        warning: '#dfa44a', // optional
        danger: '#ce5757', // optional
        customOne: '#3ebb1a', // optional
        customTwo: '#bd47fa', // optional (up to custom five)
      },
    }), // Essential, mandatory main module.
    ToastNotificationConfigModule.forRoot({
      toastCoreConfig: {
        progressBar: ToastProgressBarEnum.NONE,
        toastUserViewType: ToastUserViewTypeEnum.SIMPLE,
        animationIn: AppearanceAnimation.NONE,
        animationOut: DisappearanceAnimation.NONE,
        toastPosition: ToastPositionEnum.TOP_RIGHT,
        autoCloseDelay: 3600,
        textPosition: 'right',
        allowHtmlMessage: true,
      },
      globalSettings: {
        allowedNotificationsAtOnce: 6  // The number of toast notifications that can be shown at once.
     },
    }), // Needed for instantiating toast notifications.
    NgxMaskModule.forRoot()
  ], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
      DatePipe,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
      {
        provide: APP_INITIALIZER,
        useFactory: servicesOnRun,
        multi: true,
        deps: [LoadService],
      },
      { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }