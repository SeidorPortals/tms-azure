import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component';
import { MainNavComponent } from './pages/main-nav/main-nav.component';
import { SearchemailComponent } from './pages/resetpassword/searchemail/searchemail.component';
import { UpdatepasswordComponent } from './pages/resetpassword/updatepassword/updatepassword.component';



const routes: Routes = [

  {
     path: 'login',    component: LoginComponent
  },
  {
    path: 'recovermail',    component: SearchemailComponent
  },
  {
  path: 'updatepassword',    component: UpdatepasswordComponent
  },
  {
    
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, {
    path: '',
    component: MainNavComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./pages/main-nav/main-nav.module').then(x => x.AdminLayoutModule)
  }]},


  
  // { path: 'equipmenttypeconfigQA', component: EquipmentTypeConfigQAComponent },
  // { path: 'equipmenttypeconfigOWL/:id', component: EquipmentTypeConfigOWLComponent },
  // {
  //   path: '**',
  //   redirectTo: 'carriers'
  // },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})


export class AppRoutingModule { 
  
}