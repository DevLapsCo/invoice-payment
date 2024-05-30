import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit{

  headersWithJwt! : HttpHeaders;
  headersWithoutJwt! : HttpHeaders;

  BillingData : any;

  constructor(private route : ActivatedRoute, private http: HttpClient){
    this.headersWithJwt = new HttpHeaders({
      'Content-Type': 'application/json',
    });
     
    this.headersWithoutJwt = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

     ngOnInit() {
       this.loading = true;
      const id = this.route.snapshot.queryParamMap.get('id');
      const reference = this.route.snapshot.queryParamMap.get('reference');

      
      if(id !== null){
        this.loading = false;
        this.http.post('http://34.148.76.213:3000/api/v1/quick-bill/getData' , id, {headers : this.headersWithoutJwt}).subscribe({
          next: (n) => {
            this.BillingData = n;
        },
        error : (e) => {
          if(e.status == 404) {
            alert("Bill not found!")
          }
        }
      })
      } else if(reference !== null) {
        this.loading = false
        this.verifyPayment();
      } else {
        this.isNull= true;
        this.loading = false;
      }
      
     }

     isNull : boolean = false;
     loading : boolean = true;

     MakePayment(){
      this.http.post('http://34.148.76.213:3000/api/v1/quick-bill/init-payment', {
        email : this.BillingData!.email,
        amount: this.BillingData!.bill * 100,
        currency : "GHS",
        callback_url: "http://34.148.76.213:3000"
      }, {headers : this.headersWithoutJwt}).subscribe({
        next: (n:any) => {
          window.location.href = n!.data!.authorization_url;
        }
      })
    }
    
    paymentComplete : boolean = false;
    reference! : string;
    
    verifyPayment(){
        const reference = this.route.snapshot.queryParamMap.get('reference');
      this.http.post('http://34.148.76.213:3000/api/v1/quick-bill/verify-payment', reference
      , {headers : this.headersWithoutJwt}).subscribe({
        next: (n:any) => {
          this.paymentComplete = true;
        }
      });
     }

}
