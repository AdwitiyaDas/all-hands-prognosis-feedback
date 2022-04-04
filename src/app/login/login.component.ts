import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isEmployeeFirstLogin = false
  loginform = this.formBuilder.group({
    employeeid: '',
    password: ''
  });
  signUpForm = this.formBuilder.group({
    employeeid: '',
    password: '',
    confirmPassword:''
  });


  md5 = new Md5();
  hostname ="https://employee-feedback-app-backend.herokuapp.com";
  //hostname = "http://127.0.0.1:5000";

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
  }
  signUp(): void{
    var data={
      'employeeid': this.signUpForm.value.employeeid,
      'password': this.signUpForm.value.confirmPassword
    }
    if(this.signUpForm.value.employeeid =="" || this.signUpForm.value.password=="" )
    {
      Swal.fire({
        title: '<h2 class="theme_font">Error!</h2>',
        icon: 'error',
        html:
        '<h5 class="theme_font">Please enter valid Employee Id and Password.</h5>',
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        customClass: {
          confirmButton: 'btn btn-danger',
          
        },
        buttonsStyling: false,
        confirmButtonText:
          'Ok',
      })
     // Swal.fire('Please enter valid Employee Id and Password');
    }
    if(this.signUpForm.value.password != this.signUpForm.value.confirmPassword)
    {
      Swal.fire({
        title: '<h2 class="theme_font">Error!</h2>',
        icon: 'error',
        html:
        '<h5 class="theme_font">Passwords do not match.</h5>',
        showCloseButton: false,
        showCancelButton: false,
        focusConfirm: false,
        customClass: {
          confirmButton: 'btn btn-danger',
          
        },
        buttonsStyling: false,
        confirmButtonText:
          'Ok',
      })
      //Swal.fire('Passwords do not match');
    }
    /* Password encryprion needed */
    else{
      data['password']=Md5.hashStr(this.signUpForm.value.confirmPassword).toString()
      this.http.post<any>(`${this.hostname}/api/signup`,data ).subscribe(res => {
          if(res['code'] == 200)
            this.router.navigateByUrl('/employee_feedback/'+data.employeeid.toString());
            //this.router.navigateByUrl('/employee_feedback', { state: this.signUpForm.value.employeeid });
          else if(res['code']==401)
            Swal.fire({
              title: '<h2 class="theme_font">Error!</h2>',
              icon: 'error',
              html:
              '<h5 class="theme_font">Incorrect Employee Id or Password.</h5>',
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              customClass: {
                confirmButton: 'btn btn-danger',
                
              },
              buttonsStyling: false,
              confirmButtonText:
                'Ok',
            })
           // Swal.fire('Incorrect Employee Id or Password') ;
          else
            Swal.fire({
              title: '<h2 class="theme_font">Error!</h2>',
              icon: 'error',
              html:
              '<h5 class="theme_font">Oops!! Something went wrong!</h5>',
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              customClass: {
                confirmButton: 'btn btn-danger',
                
              },
              buttonsStyling: false,
              confirmButtonText:
                'Ok',
            })
          //Swal.fire('Oops!! Something went wrong!');        
        }
      )
    }

  }
  onSubmit(): void {
    var data={
      'employeeid': this.loginform.value.employeeid,
      'password': this.loginform.value.password
    }
    if(this.loginform.value.employeeid =="" || this.loginform.value.password=="" )
    {
      Swal.fire('Please enter valid Employee Id and Password');
    }

    else{

      data['password']=Md5.hashStr(this.loginform.value.password).toString()

      this.http.post<any>(`${this.hostname}/api/login`,data ).subscribe(res => {

          if(res['code'] == 200)
          {
            this.http.post<any>(`${this.hostname}/api/checkLastFeedbackDate`,{empId:this.loginform.value.employeeid} ).subscribe(response=>
              {
                if(response['feedbackAllowedCode'] == 200)
                  this.router.navigateByUrl('/employee_feedback/'+data.employeeid.toString());
                else if(response['feedbackAllowedCode'] == 401)
                {
                  Swal.fire({
                    title: '<h2 class="theme_font">Hi!</h2>',
                    icon: 'info',
                    html:
                    '<h5 class="theme_font">You have already submitted your feedback for today. Please come back tomorrow.</h5>',
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    customClass: {
                      confirmButton: 'btn',
                      
                    },
                    buttonsStyling: false,
                    confirmButtonText:
                      'Ok',
                  })
                }
                else
                {
                  Swal.fire({
                    title: '<h2 class="theme_font">Error!</h2>',
                    icon: 'error',
                    html:
                    '<h5 class="theme_font">Oops!! Something went wrong!</h5>',
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    customClass: {
                      confirmButton: 'btn btn-danger',
                      
                    },
                    buttonsStyling: false,
                    confirmButtonText:
                      'Ok',
                  })
                }
              }
            
            )
           
          }
           // this.router.navigate(['/employee_feedback']);
         
          else if(res['code'] == 400)
          {
   
            this.isEmployeeFirstLogin = true
          }
          else if(res['code']==401)
            Swal.fire({
              title: '<h2 class="theme_font">Error!</h2>',
              icon: 'error',
              html:
              '<h5 class="theme_font">Incorrect Employee Id or Password.</h5>',
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              customClass: {
                confirmButton: 'btn btn-danger',
                
              },
              buttonsStyling: false,
              confirmButtonText:
                'Ok',
            })
            //Swal.fire('Incorrect Employee Id or Password') ;
          else
            Swal.fire({
              title: '<h2 class="theme_font">Error!</h2>',
              icon: 'error',
              html:
              '<h5 class="theme_font">Oops!! Something went wrong!.</h5>',
              showCloseButton: false,
              showCancelButton: false,
              focusConfirm: false,
              customClass: {
                confirmButton: 'btn btn-danger',
                
              },
              buttonsStyling: false,
              confirmButtonText:
                'Ok',
            })
           // Swal.fire('Oops!! Something went wrong!');        
        }
      )
    }
  }
}
