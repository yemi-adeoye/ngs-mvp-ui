import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/impl/auth';
import { RegisterRequest } from '../../../models/register-request';
import { NgsLogo } from '../../../shared/components/ngs-logo/ngs-logo';
import { Router } from '@angular/router';

@Component({
  selector: 'ngs-register-component',
  imports: [NgsLogo, ReactiveFormsModule, NgClass],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  public registrationError = signal<string | null>(null)

  registrationForm = new FormGroup({
    firstName: new FormControl<string | null>('', Validators.required),
    lastName: new FormControl<string | null>('', Validators.required),
    username: new FormControl<string | null>('', [Validators.required, Validators.pattern(/[A-Za-z0-9_]+$/)]),
    dateOfBirth: new FormControl<string | null>('', Validators.required),
    password: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email])
  })

  handleRegistrationButtonClick() {
    const request: RegisterRequest = this.registrationForm.getRawValue()
    this.authService.register(request).subscribe({
      next: (_) => {
        this.registrationError.set(null)
        this.router.navigate(['register-success'], { state: { email: request.email } })
      },
      error: (err) => {
        if (err.error.message) {
          this.registrationError.set('Something went wrong...')
        } else {
          this.registrationError.set(err.error.msg)
        }

      }
    })
  }

  handleLoginButtonClick() {
    this.router.navigate(['/login'])
  }
}
