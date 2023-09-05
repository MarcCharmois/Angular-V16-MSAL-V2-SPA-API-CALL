import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";

import { MsalModule, MsalInterceptor, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalBroadcastService, MsalGuard, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalRedirectComponent } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType,BrowserCacheLocation } from "@azure/msal-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

  export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    
    //protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
    protectedResourceMap.set("api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/", ["user_impersonation"]);
  
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap
    };
  }

MSALInterceptorConfigFactory()

@NgModule({
  declarations: [AppComponent, HomeComponent, ProfileComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "fa2ef718-a66e-4566-a5f5-2a939264ea41", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/994d9022-89d7-44f4-91e2-3851290dc50d", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: "http://localhost:4200/", // This is your redirect URI,
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/user_impersonation"],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://socratfunction3.azurewebsites.net", [
            "all.scope",
            {
                httpMethod: "GET",
                scopes: ["api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/user_impersonation"]
            }
        ]]]),
      }
    ),
  ],
  providers: [       
    {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  }, {
    provide: MSAL_INTERCEPTOR_CONFIG,
    useFactory: MSALInterceptorConfigFactory
  }],
  bootstrap: [AppComponent, MsalRedirectComponent],

},

)
export class AppModule {}