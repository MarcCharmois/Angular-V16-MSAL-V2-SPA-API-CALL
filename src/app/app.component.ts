import { MsalService, } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from "@azure/msal-browser";
import { AppModule, MSALInterceptorConfigFactory } from './app.module';
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
  constructor(private http: HttpClient, private authService: MsalService, private myservice:GetFunctionResponseService) { }


  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
  }

  accounts: any = []
  username:string
  signedAccount:any
  login() {
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log(result);
          console.log("username: " + result.account.username)
          this.username = result.account.username
          this.signedAccount =result.account
          this.myservice.signedUserAccount = this.signedAccount

          console.log("homeAccountId: " +result.account.homeAccountId)
          this.setLoginDisplay();

          this.myservice.getFunctionToken()

          this.tokenTable = localStorage

          for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              console.log("-----------------------")
              console.log(key + ' : \n' + localStorage.getItem(key));
              //this.accounts.add(localStorage.getItem(key))
            }
          }
          /*
           for (var i = 0; i < BrowserCacheLocation.SessionStorage.length; i++) {
             console.log(i + "token")
             console.log(localStorage.getItem(i))
           }*/

          MSALInterceptorConfigFactory();
          for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              //console.log(key + ' : ' + localStorage.getItem(key));
            }
          }



          /*
           for (var i = 0; i < BrowserCacheLocation.SessionStorage.length; i++) {
             console.log(i + "token")
             console.log(localStorage[i])
           }
 */


        },
        error: (error) => console.log(error)
      });



  }

  getToken() {
    //this.app = new Msal.PublicClientApplication(msalConfig);
    //let signedInUser = this.app.getAllAccounts()[0].account;
    const accessTokenRequest = {
      scopes: ["api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/user_impersonation"],
      account: this.signedAccount

    };

    this.authService.instance.getAllAccounts()[0]
    
    this.authService
      .acquireTokenSilent(accessTokenRequest)
      .subscribe(res => {
        console.log("acquireTokenSilent");
        console.log(res.accessToken);
        //this.getUser();
        let url = "https://socratfunction3.azurewebsites.net/api/powershell-azure-function-helloworldHttpTrigger";
        let bearer2 = res.accessToken;



        //Content-Type: text/html; charset=UTF-8

        let headers = new HttpHeaders()
          .set('Content-Type', 'text/html')
          .set('Authorization', 'Bearer ' + bearer2)

        console.log("headers:")
        console.log(headers)
        /*
        let result = this.http.get(url, { headers: headers })
        .subscribe(data1 => {
          console.log(result);
          console.log("data1");
          console.log(data1)

        }
        )*/

        this.http.get(url, { headers, responseType: 'text' }).subscribe(data => console.log(data))


        return res.accessToken
      }
      )

  }
  callFunction() {

    let reponse = this.getToken();


    let bearer2 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJhcGk6Ly8xMDhkZmNhMC1mZTIyLTRkYjctOGQwZS04NGUyYWFkNDlkYmQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85OTRkOTAyMi04OWQ3LTQ0ZjQtOTFlMi0zODUxMjkwZGM1MGQvIiwiaWF0IjoxNjkzODU4NTE4LCJuYmYiOjE2OTM4NTg1MTgsImV4cCI6MTY5Mzg2MzExMSwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhVQUFBQVNzOEVvY1owZlNaRVMvb0diK1FyQlh6UEpnbnQ5QlRGc1ZnS3pZZkdjbWprRkhvTGxZYUg3Y29JVVlrMm0zMTRCclA4ckFYMWw4OTkwTnkyakR2SWpuRGZZV1ZBWkthNW1peHFSRFdWSG1ZPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiJmYTJlZjcxOC1hNjZlLTQ1NjYtYTVmNS0yYTkzOTI2NGVhNDEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkNoYXJtb2lzIiwiZ2l2ZW5fbmFtZSI6Ik1hcmMiLCJpcGFkZHIiOiIyYTA0OmNlYzA6MTkzMDo2MTQ3OmM1MGY6ZWQxZTphOWI4OmYwNTUiLCJuYW1lIjoiTWFyYyBDaGFybW9pcyIsIm9pZCI6IjQwNTA0ZjdkLTY1ZTAtNGE4NC04NzgzLThlYzVlZDgxYmQ4YSIsInJoIjoiMC5BU0FBSXBCTm1kZUo5RVNSNGpoUktRM0ZEYUQ4alJBaV9yZE5qUTZFNHFyVW5iMGdBQ28uIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiM1lmaV9GclhOMy11XzlRS2pEem4wWkVZcUFwcDlfbmE4N29mbEN2ME0xMCIsInRpZCI6Ijk5NGQ5MDIyLTg5ZDctNDRmNC05MWUyLTM4NTEyOTBkYzUwZCIsInVuaXF1ZV9uYW1lIjoibWFyYy5jaGFybW9pc0BjaGFybW9pc2Rldi5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJtYXJjLmNoYXJtb2lzQGNoYXJtb2lzZGV2Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IlY3ZzRuRGtxTmtpQl90NVd0S1lYQUEiLCJ2ZXIiOiIxLjAifQ.ho4Ti-GB1U4th47fmJzYy5MHVqq7w_hIIBCHYI4heTB3tvB69Am64Dwmr2a6vcg1k5W4m10aD7-9yvB87iC9Fdt9jynYlKESG6iBu2DGmqYk9BpmyXWjw4G1pu9184IUkrgusUXfznBuxvKqqpVjbZtoZWBU3P1QvEn8sp1IW3byjTfNeTigaEiBbhLTccHl8EtvXn85YYRFYRkP12XyMDUw-6IinP6N0GAmAiSW57sWP5OrZryfceHrvxs_sSCaRvlHXtK9r5wm9PJsuFKvlr0vCD0bzzNNNOM-T2eAvXk52_bczA-3jxDhhtHW1ql3xxh-RkWMsbPVDP50BA4bZw"
    //let url = "https://socratfunction3.azurewebsites.net/"


  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    this.callFunction();
  }
}