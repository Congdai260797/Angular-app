import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';

export function loadExternalConfig() {
  return () => new Promise((resolve, reject) => {
    // Get the pathname from the URL
    const pathname = window.location.pathname;

    // Check if the pathname is '/' (root) or '/home'
    // if (pathname !== '/') {
    //     resolve(true); // Skip loading if not on the "home" page
    //     return;
    // }

    // Load the external script if on the "home" page
    const script = document.createElement('script');
    script.src = 'assets/waiting.js';
    script.type = 'text/javascript';

    script.onload = () => {
      resolve(true); // Resolve the promise once the script is loaded
    };

    script.onerror = (error) => {
      reject(error); // Reject the promise if there's an error loading the script
    };

    // Append the script to the document's head
    document.head.appendChild(script);
  });
}


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadExternalConfig,
      deps: [],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
