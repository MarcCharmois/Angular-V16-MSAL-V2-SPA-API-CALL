import { MsalService, } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetFunctionResponseService } from './get-functionResponse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'msal-angular-tutorial';
  isIframe = false;
  loginDisplay = false;
  tokenTable: any = []
  constructor(private http: HttpClient, private authService: MsalService, private myservice: GetFunctionResponseService) { }


  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
  }

  accounts: any = []
  username: string
  signedAccount: any
  login() {
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log(result);
          console.log("username: " + result.account.username)
          this.username = result.account.username
          this.signedAccount = result.account
          this.myservice.signedUserAccount = this.signedAccount

          console.log("homeAccountId: " + result.account.homeAccountId)
          this.setLoginDisplay();
          /*
          this.myservice.getFunctionToken()

          this.tokenTable = localStorage

          for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              console.log("-----------------------")
              console.log(key + ' : \n' + localStorage.getItem(key));
            }
          }*/
          /*
           for (var i = 0; i < BrowserCacheLocation.SessionStorage.length; i++) {
             console.log(i + "token")
             console.log(localStorage.getItem(i))
           }*/
        },
        error: (error) => console.log(error)
      });



  }

  /*
  getToken() {
    const accessTokenRequest = {
      scopes: ["api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/user_impersonation"],
      account: this.signedAccount
    };

    this.authService
      .acquireTokenSilent(accessTokenRequest)
      .subscribe(res => {
        console.log("acquireTokenSilent");
        console.log(res.accessToken);
        let url = "https://socratfunction3.azurewebsites.net/api/powershell-azure-function-helloworldHttpTrigger";
        let bearer2 = res.accessToken;
        let headers = new HttpHeaders()
          .set('Content-Type', 'text/html')
          .set('Authorization', 'Bearer ' + bearer2)

        console.log("headers:")
        console.log(headers)

        this.http.get(url, { headers, responseType: 'text' }).subscribe(data => console.log(data))


        return res.accessToken
      }
      )
  }

  callFunction() {
    let reponse = this.getToken();
  }
*/
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    let url = "https://socratfunction3.azurewebsites.net/api/powershell-azure-function-helloworldHttpTrigger";
    
    //@azure/msal-angular interceptor automatically generates the token to call the api
    /*
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      console.log("trying interceptor");
      console.log(data)
    })*/
    //this.callFunction();
  }
}