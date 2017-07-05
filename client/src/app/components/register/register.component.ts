import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup,Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup; // <--- form is of type FormGroup

   constructor(private formBuilder: FormBuilder) {
     this.createForm();
   }

   createForm() {
    this.form = this.formBuilder.group({
      email:['', Validators.required ],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)]) ],
      password: ['', Validators.required ],
      confirm_password: ['', Validators.required ]
    });
  }

  onRegisterSubmit(){
    console.log("Form Submittted");
  }

  

 

  ngOnInit() {
  }

}
