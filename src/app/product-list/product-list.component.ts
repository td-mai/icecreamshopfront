import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import {Product} from '../product'
import { Observable, Subject } from 'rxjs';
import {NgForm} from '@angular/forms';
import { environment } from '../../environments/environment';
import {detailOrder} from '../detailOrder';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  image_root = environment.apiRoot;
  current_order = [];
  tmp_total_prix = 0;
  client_name: string = "";
  detailOrder: detailOrder;

  messageError: string

  constructor(private productService: ProductService) {

  }
  ngOnInit(): void {

    this.getProducts()
  }
   getProducts(): void {
    this.productService.getProducts()
        .subscribe(products => {
        for (let i = 0; i < products.length; i++) {
          products[i].image = this.image_root + products[i].image
          products[i].tmp_order_quantity = 0
        }
        this.products = products
        },
        error => this.messageError = "Une erreur est survenue. Veuillez reéssayer plus tard."
        );
  }
  addProduct(productId): void {
     this.messageError=""
     let selected_product = this.products.find(x => x.id === productId);

     if(selected_product.tmp_order_quantity > selected_product.remaining_quantity){
        let pluriel = selected_product.remaining_quantity>1 ? 's': ''
        this.messageError = `${selected_product.remaining_quantity} ${selected_product.flavor} restante${pluriel}.`
        return;
     }

     let added_prod = this.current_order.find(x => x.id === productId)
     if ( added_prod == undefined) {
        let new_added_prod = {
          id: selected_product.id,
          flavor: selected_product.flavor,
          unit_price: selected_product.unit_price,
          tmp_order_quantity: selected_product.tmp_order_quantity,
          remaining_quantity: selected_product.remaining_quantity,
          tmp_price: selected_product.unit_price * selected_product.tmp_order_quantity
        }
        this.current_order.push(new_added_prod)
     }else{
         added_prod.tmp_order_quantity = selected_product.tmp_order_quantity
         added_prod.remaining_quantity = selected_product.remaining_quantity
         added_prod.tmp_price = selected_product.unit_price * selected_product.tmp_order_quantity
     }

    this.current_order = this.current_order.filter(obj => obj.tmp_order_quantity > 0)
    this.tmp_total_prix = this.current_order.reduce( (prev, cur) => prev + cur.tmp_price, 0)
  }

  orderValide(): void {
    this.messageError = ""

    let product_orders = []
    for (let i = 0; i < this.current_order.length; i++){
      product_orders.push({
        "product": this.current_order[i].id,
        "quantity": this.current_order[i].tmp_order_quantity
      })
    }
    let order_data = {
      client_name: this.client_name.trim(),
      product_orders: product_orders
    }
    this.productService.createOrder(order_data).subscribe(
      detailOrder => {
        this.detailOrder = detailOrder
        this.clearTmpOrder()
        this.getProducts()
      },
      error => {
        console.log(error)
        this.messageError = String(error.message)
      }
    )
  }

  clearTmpOrder(): void {
    this.current_order = []
    this.tmp_total_prix = 0
    this.client_name = ''
  }
}
