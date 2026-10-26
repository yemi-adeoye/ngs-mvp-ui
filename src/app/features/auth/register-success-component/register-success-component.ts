import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgsLogo } from '../../../shared/components/ngs-logo/ngs-logo';

@Component({
  selector: 'ngs-register-success-component',
  imports: [NgsLogo],
  templateUrl: './register-success-component.html',
  styleUrl: './register-success-component.scss',
})
export class RegisterSuccessComponent {
  private readonly location = inject(Location)
  readonly email = (this.location.getState() as { email?: string }).email

}
