import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatchPassword } from '../validators/match-password';
import { UniqueUsername } from '../validators/unique-username';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  authForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(32),
      Validators.pattern(/^[a-z0-9_]+$/)
    ], [this.uniqueUsername.validate]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
    ]),
  }, { validators: [this.matchPassword.validate] })

  constructor(private matchPassword: MatchPassword, private uniqueUsername: UniqueUsername, private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.authService.signup(this.authForm.value).subscribe({
      next: response => {
        // Navigate to some other route
      },
      error: err => {
        this.authForm.setErrors({ unknownError: true });
      }
    });
  }

}
