import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatchPassword } from '../validators/match-password';

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
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/)
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
    ]),
  }, { validators: [this.matchPassword.validate] })

  constructor(private matchPassword: MatchPassword) { }

  ngOnInit(): void {
  }

}
