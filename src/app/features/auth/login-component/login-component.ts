import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgsLogo } from '../../../shared/components/ngs-logo/ngs-logo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/impl/auth';
import { LoginRequest } from '../../../models/login-request';

@Component({
  selector: 'ngs-login-component',
  imports: [NgsLogo, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  loginError = signal<string | null>(null)

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required })
  })

  handleRegisterButtonClick() {
    this.router.navigate(['/register'])
  }

  handleLoginButtonClick() {
    const loginRequest: LoginRequest = this.loginForm.getRawValue();
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log(response)
        if (!response.access_token) {
          this.loginError.set("Something went wrong please try again later")
          return
        }
        this.loginError.set(null)
        this.authService.authState.set('authenticated')
        this.authService.accessToken.set(response.access_token)

        this.router.navigate(['/app'])
      },
      error: (err) => {
        console.log(err)
        if (err?.error?.msg == 'verification pending') {
          this.loginError.set('Please verify your email to gain access to NaijaGistSoccer')
        } else {
          this.loginError.set(err?.error?.msg)
        }
      }
    })
  }
}
