import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GetFunctionResponseService } from '../get-functionResponse.service';
import { MsalBroadcastService } from "@azure/msal-angular";
import { MsalService } from "@azure/msal-angular";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  displayName = null;
  bi3_access_token = null;
  subscriptionList: any = [];

  constructor(private BroadcastService: MsalBroadcastService, private authService: MsalService,
    private router: Router, private getFunctionService: GetFunctionResponseService,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  title = 'Geek Joke';
  joke: any = "Click the button below to call the function";



  async fetchJoke() {
    this.joke = "function called...waiting for response";
    //this.joke = await this.getFunctionService.getFunctionResponse();
    this.joke = await this.getFunctionService.getFunctionResponse()
    console.log(this.joke)
  }

}
