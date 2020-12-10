export interface OrderModel {
  id: string;
  order_date: Date;
  shipped_date: Date;
  ship_name: string;
  ship_address: string;
  ship_city: string;
  ship_state_province: string;
  ship_zip_postal_code: string;
  ship_country_region: string;
  shipping_fee: Number;
  taxes: Number;
  payment_type: string;
  paid_date: Date;
  notes: string;
  tax_rate: Number;
  quantity: Number;
  unit_price: Number;
  discount: Number;
  date_allocated: Date
}