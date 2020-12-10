import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { InsertOrderFormComponent } from './components/insert-order-form.component';
import { OrderService } from './services/order.service';

const ROUTES: Routes = [
  { path: '', component: InsertOrderFormComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    InsertOrderFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
