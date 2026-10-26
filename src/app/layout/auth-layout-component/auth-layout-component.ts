import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/impl/auth';

@Component({
  selector: 'ngs-auth-layout-component',
  imports: [RouterOutlet],
  templateUrl: './auth-layout-component.html',
  styleUrl: './auth-layout-component.scss',
})
export class AuthLayoutComponent {
  private readonly authService = inject(AuthService)

  ngOnInit(): void {
    console.log("-->from root: ", this.authService.accessToken())
  }
}
