import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MsalService, } from '@azure/msal-angular';

//this service call the API using acquireTokenSilent

@Injectable({
  providedIn: 'root'
})
export class GetFunctionResponseService {
  constructor(
    private http: HttpClient, private authService: MsalService
  ) { }

  public signedUserAccount: any;
  private accessToken: any;

  private url: string = "https://helloworldfunction1123.azurewebsites.net/api/powershell-azure-function-helloworldHttpTrigger?";


  //use this if you want to get the token and decrypt it with jwt.io
  getFunctionToken() {
    //No need to add account if you stay signed in within your browser but you must 
    //add the account if you are in Incognito/private window/tab
    const accessTokenRequest = {
      scopes: ["api://108dfca0-fe22-4db7-8d0e-84e2aad49dbd/user_impersonation"],
      account: this.signedUserAccount

    };

    this.authService
      .acquireTokenSilent(accessTokenRequest)
      .subscribe(res => {
        console.log("acquireTokenSilent");
        console.log(res.accessToken);
        this.accessToken = res.accessToken;
      })
  }

  //with http Interceptor of MSAL Angular the token is genrated automatically and attached to 
  //the http requast so no need to generate it
  //uncomment the lines if you want use the token and see it anyway
  async getFunctionResponse() {

    let url = "https://helloworldfunction1123.azurewebsites.net/api/powershell-azure-function-helloworldHttpTrigger?";
    //let bearer2 = this.accessToken;
    let headers = new HttpHeaders()
      .set('Content-Type', 'text/html')
      //.set('Authorization', 'Bearer ' + bearer2)

    console.log("headers:")
    console.log(headers)

    return this.http.get(url, { headers, responseType: 'text' }).toPromise()
  }

}
