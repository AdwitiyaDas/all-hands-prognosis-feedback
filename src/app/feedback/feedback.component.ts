import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common'
import { NgForm } from '@angular/forms';
import { textSpanIsEmpty } from 'typescript';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  tinyAlert() {
    Swal.fire('All feilds are Mandatory');
  }

 
  //DECLARING ALL THE VARIBALES
  overall: any;
  Salary: any;
  currentDate = new Date();
  latest_date = this.datepipe.transform(this.currentDate, 'dd-MM-yyyy');
  name = "USER"
  lname = "sahu"
  eid =""
  questionDict = {}
  hostname ="https://employee-feedback-app-backend.herokuapp.com"
  //hostname = "http://127.0.0.1:5000"
 
  feedbackObjArray =  Array<questionObj>()
  ratingsArray = Array<boolean>()
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private http: HttpClient, public datepipe: DatePipe) {
      // this.feedbackObjArray.push({
      //    'id' : Number(1),
      //    'desc': 'abc',
      //    'ratings': [false,false,false,false]
      //  })

      //  this.feedbackObjArray.push({
      //   'id' : Number(2),
      //   'desc': 'def',
      //   'ratings': [false,false,false,false]
       
      // })
  }

  ngOnInit(): void {
    this.eid = String(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log(this.eid)
    this.http.post<any>(`${this.hostname}/api/getEmployeeName`,{empId:this.eid}).subscribe(res => {
          
        if(res['code'] == 200)
        {
          this.name=res['empName']
          this.getQuestions();
        }
          
        else if(res['code']==401)
        {
          Swal.fire('Unauthorized Alert!') ;
          this.router.navigateByUrl('');
        }
        
        else
          Swal.fire('Oops!! Something went wrong!');        
  })
  

}
 getQuestions()
 {
        this.http.post<any>(`${this.hostname}/api/getFeedbackQuestions`,{empId:this.eid}).subscribe(res => {
                      
          if(res['code'] == 200)
          {
            this.questionDict = res['questionDict']

            for(var key in res['questionDict'])
            { 
              this.feedbackObjArray.push({
                'id' : Number(key),
                'desc': res['questionDict'][key],
                'ratings': [false,false,false,false]
                
              })
            }
              
          }
            
          else if(res['code']==401)
          {
            Swal.fire('Unauthorized Alert!') ;
            this.router.navigateByUrl('');
          }
          
          else
            Swal.fire('Oops!! Something went wrong!');        
      })
 }

  submitForm() {
    let answerMissing = false
    for(var i=0; i < this.feedbackObjArray.length; i++)
    {
      let x = this.feedbackObjArray[i].ratings.indexOf(true)
   
      if (x == -1)
      {
        answerMissing = true

        Swal.fire({
          title: '<h2 class="theme_font">Error!</h2>',
          icon: 'error',
          html:
          '<h5 class="theme_font">Please respond to all questions</h5>',
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
        //Swal.fire('Please respond to all questions.')
         break;
      }

    }
   
    if(!answerMissing)
    {
    
      var data={
        'empId': this.eid,
        'entryDate' : this.latest_date,
        'feedbackJson' : this.feedbackObjArray
      }
      this.http.post<any>(`${this.hostname}/api/submitFeedbackData`,data).subscribe(res => {
          
        if(res['code'] == 200)
          Swal.fire({
            title: '<h2 class="theme_font">Success!</h2>',
            icon: 'success',
            html:
            '<h5 class="theme_font">Feedback submitted successfully</h5>',
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            customClass: {
              confirmButton: 'btn btn-success',
              
            },
            buttonsStyling: false,
            confirmButtonText:
              'Ok',
          }).then(x=>this.router.navigateByUrl('/'))
          //Swal.fire('Feedback submitted successfully') ;
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
         // Swal.fire('Oops!! Something went wrong!');       
        })
    }
      
  }

  selectRating(i : number, rating: number) : void
  {

    this.feedbackObjArray[i].ratings=[false,false,false,false]
    this.feedbackObjArray[i].ratings[rating]=true
  }


  logout()
  {
    this.router.navigateByUrl('/');
  }

}


class questionObj {
  id: number | undefined;
  desc: string | undefined;
  ratings: any;
}
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
