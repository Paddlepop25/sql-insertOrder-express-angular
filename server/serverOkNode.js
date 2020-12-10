// 1. import all the node modules
const express = require('express'),
  bodyParser = require('body-parser'),
  secureEnv = require('secure-env'),
  cors = require('cors'),
  mysql = require('mysql2/promise')

// 2. construct new express object
const app = express()

// 3. Initialize all the relevant params for the  express middleware
app.use(cors())

//limit: '50mb' is to limit request so won't get hacked
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

// 4. Integrate with secure env
global.env = secureEnv({ secret: 'isasecret' })

// 5. get port env variable value fom secure env
const APP_PORT = global.env.APP_PORT
// console.log('APP_PORT ---> ', APP_PORT)

// 6. create MySQL connection Pool to connect to database
// require to pass in all the database credentials (take from .env)
const pool = mysql.createPool({
  host: global.env.MYSQL_SERVER,
  port: global.env.MYSQL_SVR_PORT,
  user: global.env.MYSQL_USERNAME,
  password: global.env.MYSQL_PASSWORD,
  connectionLimit: global.env.MYSQL_CON_LIMIT,
  database: global.env.MYSQL_SCHEMA,
})

// 7. Establish connection
const startApp = async (app, pool) => {
  const conn = await pool.getConnection()
  try {
    await conn.ping()
    console.log('Test database connection...')
    app.listen(APP_PORT, () => {
      console.log(`App started on ${APP_PORT}`)
    })
  } catch (error) {
    console.log(error)
  } finally {
    conn.release
  }
}

// 9 Construct SQL
const SQL_getOrders = `select * from orders;`

const SQL_insertOrders = `
INSERT into orders 
(order_date, shipped_date, ship_name, ship_city,
  ship_zip_postal_code, shipping_fee, payment_type)
values (?, ?, ?, ?, ?, ?, ?);
`
const SQL_insertOrderDetail = `
INSERT into order_details
(order_id, quantity, unit_price, discount, date_allocated)
values (?, ?, ?, ?, ?);
`
const insertOrders = async (
  order_date,
  shipped_date,
  ship_name,
  ship_city,
  ship_zip_postal_code,
  shipping_fee,
  payment_type,
  quantity,
  unit_price,
  discount,
  date_allocated
) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    let getOrders = await conn.query(`select * from orders order by id asc;`)
    //console.log('getOrders ---> ', getOrders[0])

    let orderResult = await conn.query(SQL_insertOrders, [
      order_date,
      shipped_date,
      ship_name,
      ship_city,
      ship_zip_postal_code,
      shipping_fee,
      payment_type,
    ])
    // let orderResult = await conn.query(
    //   `INSERT into orders
    //  (order_date, shipped_date, ship_name, ship_city,
    //    ship_zip_postal_code, shipping_fee, payment_type)
    //   values ('2020-12-24', '2020-12-24', 'BOAT', 'BOAT', 'BOAT', 2, 'paymenttype');
    //  `
    // )
    // //console.log(
    //   'orderResult1 ---> ',
    //   orderResult.order_date,
    //   orderResult.payment_type
    // ) // insertId auto generate primary key
    console.log('orderResult id ---> ', orderResult[0].insertId) // insertId auto generate primary key
    console.log('quantity ---> ', quantity) // undefined
    let orderDetailResult = await conn.query(SQL_insertOrderDetail, [
      orderResult[0].insertId, // insertId auto generate primary key
      quantity,
      unit_price,
      discount,
      date_allocated,
    ])
    // let orderDetailResult = await conn.query(
    //   `INSERT into order_details
    //   (order_id, quantity, unit_price, discount, date_allocated)
    //    values (LAST_INSERT_ID(), 7, 7, '17', '2020-12-24');
    //   `
    // )
    console.log('orderDetailResult id ---> ', orderDetailResult[0].insertId)
    await conn.commit()
  } catch (err) {
    console.error('Error ---> ', err)
    conn.rollback()
    res.status(500)
    res.json({ ERROR: err.message })
  } finally {
    conn.release()
  }
}

// 8. Test homepage
app.get('/', (req, res) => {
  res.status(200)
  res.type('application/json')
  res.send({ Hello: 'Kitty' })
})

app.post('/order', (req, res) => {
  //console.log(req)
  const order_date = req.body.order_date
  const shipped_date = req.body.shipped_date
  const ship_name = req.body.ship_name
  const ship_city = req.body.ship_city
  const ship_zip_postal_code = req.body.ship_zip_postal_code
  const shipping_fee = req.body.shipping_fee
  const payment_type = req.body.payment_type
  const quantity = req.body.quantity
  const unit_price = req.body.unit_price
  const discount = req.body.discount
  const date_allocated = req.body.date_allocated
  console.log(
    'order_date, payment_type, discount, quantity ---> ',
    order_date,
    payment_type,
    discount,
    quantity
  )

  insertOrders(
    order_date,
    shipped_date,
    ship_name,
    ship_city,
    ship_zip_postal_code,
    shipping_fee,
    payment_type,
    quantity,
    unit_price,
    discount,
    date_allocated
  )
  console.log('ORDER INSERTED!')
  res.status(200)
  res.json({ Message: 'SUCCESS!!' })
})

// 10. Redirects back to homepage if resource not found
app.use((req, res) => {
  res.redirect('/')
})

// 11. Start the app
startApp(app, pool)
