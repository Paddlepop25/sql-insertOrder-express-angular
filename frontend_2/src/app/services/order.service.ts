import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { OrderModel } from '../models/order.model'

@Injectable()
export class OrderService {

  httpOptions = {
    // check: x-www-form-urlencoded only if we are writing using express to serve as html
    // headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) 
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  async addOrder(order: OrderModel): Promise<any> {
    console.info('order', order) // can get values in console
    return await this.http.post(environment.apiUrl, order, this.httpOptions)
      .toPromise()
      .catch((error: HttpErrorResponse) => {
        console.log('HttpError ---> ', error)
      })
  }
}