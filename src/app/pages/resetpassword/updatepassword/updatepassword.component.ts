import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.css']
})
export class UpdatepasswordComponent implements OnInit {

  constructor(private router: Router,
    private formBuilder: FormBuilder) { }

  addForm: FormGroup = this.formBuilder.group({

    "PASSWORD": new FormControl('')
    }
  )
  ngOnInit(): void {
  }
  update(closescreen: boolean) 
  {
    // this.loginService.Auth(this.addForm.value).subscribe(
    //   {
    //     next: data => 
    //     {
    //       //console.log(data['user'][0].ROLE_ID);
    //       if(data['token'])
    //       {
    //         let list: string[] = [];
    //         //console.log(data['token'], "created!");
    //         localStorage.setItem('token', data['token']);
    //         localStorage.setItem('email', this.addForm.controls['USER_ID'].value);
    //         list.push(data['user'][0].ROLE_ID);
    //         this.ps.loadPermissions(list);

    //         this.starttimming(this.idle, this.keepalive);
    //         //this.openConfirmationDialog();
            this.router.navigate(['/login']);
    //       }
    //     },
    //     error: error => 
    //     {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Authentication Failed!',
            
    //       }).then((result) => 
    //       {
    //         if (result.dismiss === Swal.DismissReason.timer && closescreen == true) 
    //         {
    //           //this.router.navigate(['/consignees']);
    //           //localStorage.clear();
    //         }
    //       })
    //     }
    //   }   
    // )
  }
}
