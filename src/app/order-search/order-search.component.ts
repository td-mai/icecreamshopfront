import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import {detailOrder} from '../detailOrder';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-order-search',
  templateUrl: './order-search.component.html',
  styleUrls: ['./order-search.component.css']
})
export class OrderSearchComponent implements OnInit {

  orderNumber: string=""
  detailOrder: detailOrder
  messageError : string=""
  imageRoot = environment.apiRoot;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  getOrder(): void {
    this.detailOrder = undefined
    this.messageError=""
    if(this.orderNumber === ""){

      return;
    }
    this.orderService.getOrder(this.orderNumber.trim())
        .subscribe(order => {
          this.detailOrder = order
        },
        error => {
           if (error.status==404){
            this.messageError = `Commande numéro ${this.orderNumber} n'existe pas.`
           }
           else{
            this.messageError = "Une erreur est survenue. Veuillez reéssayer plus tard."
           }
        }
        )

  }
}
