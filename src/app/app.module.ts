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
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

/* 
 //this is for  version 1 of MSAL:
 export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
   const protectedResourceMap = new Map<string, Array<string>>();

   protectedResourceMap.set("https://helloworldfunction1123.azurewebsites.net/", ["api://a30c6d65-3d0b-415e-9dc7-4587fae74e2e/user_impersonation"]);
 
   return {
     interactionType: InteractionType.Redirect,
     protectedResourceMap
   };
 }

 //This is still working with working Interceptor, if you add the following code to the providers of the @ngmodule

  , {
   provide: MSAL_INTERCEPTOR_CONFIG,
   useFactory: MSALInterceptorConfigFactory
 }
 That is no longer working:
 MsalAngularConfiguration has been deprecated and no longer works.
 source: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/msal-interceptor.md
 */

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
      // MSAL Configuration V2. Mandatory! V1 outside NgModule no longer works
      new PublicClientApplication({
        auth: {
          clientId: "9fefb62c-5e82-4a09-acc3-ea077f8164f3", // Application (client) ID from the app registration
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
          scopes: ["api://a30c6d65-3d0b-415e-9dc7-4587fae74e2e/user_impersonation"],
        },
      },
      //interceptor Configuration V2. V1 outside NgModule still works but you must add declaration in providers
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://helloworldfunction1123.azurewebsites.net/", [
                        {
                httpMethod: "GET",
                scopes: ["api://a30c6d65-3d0b-415e-9dc7-4587fae74e2e/user_impersonation"],
            }
        ]]]),
      }
    ),
  ],
  providers:
    [   {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    } ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }