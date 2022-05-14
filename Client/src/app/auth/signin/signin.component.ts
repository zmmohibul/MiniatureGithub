import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  users: any;

  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(response => {
      this.users = response;
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.signin(this.loginForm.value).subscribe({
      next: () => {
        console.log("Login successfull");
        
      },
      error: (err) => {
        if (err.status === 401) {
          this.loginForm.setErrors({ invalidCredentials: true })
        } else {
          this.loginForm.setErrors({ unknownError: true })
        }
      }
    })
  }

}
