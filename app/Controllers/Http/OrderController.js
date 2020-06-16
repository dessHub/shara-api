'use strict'

const Mail = use('Mail')
const Order = use('App/Models/Order')
const History = use('App/Models/History')

class OrderController {
  async index ({response}) {
    let orders = await Order.query()
                  .with('histories.product')
                  .with('user')
                  .fetch()

    return response.json(orders)
  }

  async show ({params, response}) {
    try {

      const order = await Order.find(params.id)
      const histories = await order
           .histories()
           .fetch()
      const user = await order
           .user()
           .fetch()

      Object.assign(order, {user}, histories)

      return response.json(order)
    } catch (e) {
      return response.json({message: e})
    }
  }

  async myorders ({params, response, auth}) {
    try {

      const authUser = await auth.getUser()
      let orders = await Order
            .query()
            .with('histories.product')
            .fetch()
      let jsonOrders = orders.toJSON();

      orders = jsonOrders.filter(item => item.user_id === authUser.id)

      return response.json(orders)
    } catch (e) {
      return response.json({message: e})
    }
  }

  // Get authenticated user's order
  async retrieve ({params, auth, response}) {
    try {
      const authUser = await auth.getUser()
      const order = await Order.find(params.id)
      const user = await order
        .user()
        .fetch()

      if (user.id === authUser.id) {
        const histories = await order
             .histories()
             .fetch()

        Object.assign(order, {user}, histories)

        return response.json(order)
      } else {
        return response.json({message: 'Not authorized to view this order.'})
      }
    } catch (e) {
      return response.json({message: e})
    }
  }

  async store ({request, response, auth}) {
    const { amount, noProducts, products } = request.all()

    const authUser = await auth.getUser()

    let order = new Order()
    order.amount = amount
    order.no_products = noProducts
    order.user_id = authUser.id

    await order.save()

    await Mail.send('emails.welcome', {order}, (message) => {
      message.from('desshub95@gmail.com')
      message.to(authUser.email)
    })
    const orderId = order.id

    const reducedProducts = products.reduce((acc, product) => {
      const productObj = {}
      productObj.order_id = orderId
      productObj.product_id = product.id
      productObj.quantity = product.quantity
      acc.push(productObj)
      return acc;
    }, [])


    await order.histories()
          .createMany(reducedProducts)

    order = await Order.find(orderId)
    const histories = await order
         .histories()
         .fetch()
    const user = await order
         .user()
         .fetch()

    Object.assign(order, {user}, histories)
    return response.status(201).json(order)
  }
}

module.exports = OrderController
