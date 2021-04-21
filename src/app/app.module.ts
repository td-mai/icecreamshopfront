import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';

import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS} from  '@angular/common/http';
import {XsrfInterceptor} from './xsrfInterceptor';
import { HeaderComponent } from './header/header.component';
import { OrderSearchComponent } from './order-search/order-search.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    HeaderComponent,
    OrderSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "csrftoken",
      headerName: "X-CSRFToken",
    }),
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'home', component: ProductListComponent },
      { path: 'search', component: OrderSearchComponent },
    ])
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
