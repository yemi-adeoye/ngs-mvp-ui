import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/impl/auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngs-authenticated-layout-component',
  imports: [RouterOutlet],
  templateUrl: './authenticated-layout-component.html',
  styleUrl: './authenticated-layout-component.scss',
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService)

  ngOnInit(): void {
    console.log("-->from root: ", this.authService.accessToken())
  }
}
