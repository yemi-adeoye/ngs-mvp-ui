import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout-component/auth-layout-component';
import { AuthenticatedLayoutComponent } from './layout/authenticated-layout-component/authenticated-layout-component';
import { LoginComponent } from './features/auth/login-component/login-component';
import { RegisterComponent } from './features/auth/register-component/register-component';
import { VerifyEmailComponent } from './features/auth/verify-email-component/verify-email-component';
import { FeedComponent } from './features/feed/feed-component/feed-component';
import { RegisterSuccessComponent } from './features/auth/register-success-component/register-success-component';
import { registerSuccessGuard } from './shared/guards/register-success-guard-guard';
import { authGuard } from './shared/guards/auth-guard';
import { publicGuard } from './shared/guards/public-guard';
import { AudioPreviewer } from './features/posts/audio-previewer/audio-previewer';
import { ImagePreviewer } from './features/posts/image-previewer/image-previewer';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verify',
        component: VerifyEmailComponent
      }
      ,
      {
        path: 'register-success',
        component: RegisterSuccessComponent,
        canActivate: [registerSuccessGuard]
      }
    ],
    canActivate: [publicGuard]
  },

  {
    path: 'app',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: 'feed',
        component: FeedComponent
      },
      {
        path: 'audio',
        component: AudioPreviewer
      },
      {
        path: 'media',
        component: ImagePreviewer
      }
    ],
    // canActivate: [authGuard]
  }
];
