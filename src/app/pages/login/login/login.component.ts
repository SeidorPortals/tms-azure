import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginServiceService } from 'src/app/services/loginService/login-service.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SessionmodalService } from '../../../components/modal/sesion-modal/sessionmodal.service';
import { ToastEvokeService } from '@costlydeveloper/ngx-awesome-popup';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: any;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  closeResult: string = '';
  //addUserForm: FormGroup = new FormGroup({});
  constructor(private loginService: LoginServiceService, 
              private formBuilder: FormBuilder, 
              private toastEvoke: ToastEvokeService,
              private ps: NgxPermissionsService, 
              private router: Router,
              private idle: Idle, 
              private keepalive: Keepalive,
              private modalService: NgbModal,
              private sessionService: SessionmodalService) { }

  addForm: FormGroup = this.formBuilder.group({

    "USER_ID": ['',Validators.required],
    "PASSWORD": ['', Validators.required]
  }
  )

  ///Session Modal
  watchSession: boolean = false;
  tripID: string = '';
  remain: string = '';
  ngOnInit(): void {

    if (localStorage.getItem('email')) {
      this.users = localStorage.getItem('email');

    }

    // console.log(localStorage.getItem('email'));
    // console.log(localStorage.getItem('token'));
    this.loginService.getUsers().subscribe(
      resp => {
        this.users = resp;
        // console.log(resp);
      }
    );
  

  }





  async onSubmit(addUserForm: NgForm) {
    if (addUserForm.invalid) {
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Wait',
      text: 'Starting',
      allowOutsideClick: false
    });



    Swal.showLoading;



    const response = await this.loginService.tryLogin(this.addForm[0]);
    //console.log('RESPONSE LOGN', response);
    if (response) {
      setTimeout(() => {
        Swal.close();
        localStorage.setItem('email', this.addForm[0].email);
        this.router.navigateByUrl('/home');
      }, 1500);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Wait',
        text: 'Starting',
        allowOutsideClick: false
      });
    }



  }

  validarcampos(campo: string, form: FormGroup) {
    return form.controls[campo].errors && form.controls[campo].touched;
  }

  loginAuth(closescreen: boolean) 
  {
    if(this.addForm.invalid){
      this.addForm.markAllAsTouched();
      this.toastEvoke.warning('INVALID FORM', 'Review your entries and try again.');
      return;
    }
    

    let user = this.addForm.get('USER_ID').value;
    this.addForm.get('USER_ID').setValue(user.trim());
    this.loginService.Auth(this.addForm.value).subscribe(
      {
        next: data => 
        {
          //console.log(data['user'][0].ROLE_ID);
          if(data['token'])
          {
            let list: string[] = [];
            //console.log(data['token'], "created!");
            localStorage.setItem('token', data['token']);
            localStorage.setItem('email', this.addForm.controls['USER_ID'].value);
            list.push(data['user'][0].ROLE_ID);
            this.ps.loadPermissions(list);

            this.starttimming(this.idle, this.keepalive);
            //this.openConfirmationDialog();
            this.router.navigate(['/home']);
          }
        },
        error: error => 
        {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Authentication Failed!',
            
          }).then((result) => 
          {
            if (result.dismiss === Swal.DismissReason.timer && closescreen == true) 
            {
              //this.router.navigate(['/consignees']);
              //localStorage.clear();
            }
          })
        }
      }   
    )
  }

  

  starttimming(idle: Idle, keepalive: Keepalive) {
    
    //alert();
    // sets an idle timeout of 30 minutes, for testing purposes.
    idle.setIdle(1800);
    // sets a timeout period of 60 seconds. after 120 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => (this.idleState = 'No longer idle.'));
    
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.router.navigate(['/login']);
    });
    idle.onIdleStart.subscribe(() => (this.idleState = "You've gone idle!"));
    idle.onTimeoutWarning.subscribe(
      (countdown) =>
        (
          this.openConfirmationDialog("Session Timeout","You will time out in " + countdown + " seconds!", countdown.toString()),this.idleState = 'You will time out in ' + countdown + ' seconds!')
        
    );

    // sets the ping interval to 60 seconds
    keepalive.interval(60);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  open(content:any,id: string) 
  {
    //console.log(id)
    if(id=="60")
    {
      
      this.modalService.open(content, {backdrop: false, size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult);
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  public openConfirmationDialog(title: string, message: string, secremain: string) {
    if(secremain=="60")
    {
      this.sessionService.confirm(title, message)
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

}
