import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderModel } from '../models/order.model';
import { OrderService } from '../services/order.service';
// import { OrderModel } from '../models/order.model';

@Component({
  selector: 'app-insert-order-form',
  templateUrl: './insert-order-form.component.html',
  styleUrls: ['./insert-order-form.component.css']
})
export class InsertOrderFormComponent implements OnInit {

  insertForm: FormGroup
  constructor(private fb: FormBuilder, private addOrderSvc: OrderService ) { }

  ngOnInit(): void {
    this.insertForm = this.fb.group({
      order_date: this.fb.control('', []),
      shipped_date: this.fb.control('', []),
      ship_name: this.fb.control('', []),
      ship_city: this.fb.control('', []),
      ship_zip_postal_code: this.fb.control('', []),
      shipping_fee: this.fb.control('', []),
      payment_type: this.fb.control('', []),
      order_id: this.fb.control('', []),
      quantity: this.fb.control('', []),
      unit_price: this.fb.control('', []),
      discount: this.fb.control('', []),
      date_allocated: this.fb.control('', []),
    })
  }

  insertId() {
    let order_date = this.insertForm.get('order_date').value
    let shipped_date = this.insertForm.get('shipped_date').value
    let ship_name = this.insertForm.get('ship_name').value
    let ship_city = this.insertForm.get('ship_city').value
    let ship_zip_postal_code = this.insertForm.get('ship_zip_postal_code').value
    let shipping_fee = this.insertForm.get('shipping_fee').value
    let payment_type = this.insertForm.get('payment_type').value
    let quantity = this.insertForm.get('quantity').value
    let unit_price = this.insertForm.get('unit_price').value
    let discount = this.insertForm.get('discount').value
    let date_allocated = this.insertForm.get('date_allocated').value
    console.log(order_date, payment_type, discount, quantity) // can log

    this.addOrderSvc.addOrder(
      { order_date, shipped_date, ship_name, ship_city, 
        ship_zip_postal_code, shipping_fee, payment_type, quantity, unit_price,
        discount, date_allocated } as OrderModel)
        .then(result => {
          console.log(result) // {message: SUCCESS!!} from app.post
        })
    this.insertForm.reset()
  }
}