'use strict'

const Order = use('App/models/Order')
const History = use('App/models/History')

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
            .with('histories')
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
    const orderId = order.id

    const reducedProducts = products.reduce((acc, product) => {
      product.order_id = orderId
      acc.push(product)
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