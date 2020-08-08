'use strict'

const Product = use('App/Models/Product')

class ProductController {
  async index ({response}) {
    let products = await Product.all()

    return response.json(products)
  }

  async show ({params, response}) {
    try {

      const product = await Product.find(params.id)

      return response.json(product)
    } catch (e) {
      return response.json({message: 'You are not authorized to perform this action'})
    }
  }

  async store ({request, response}) {
    try {
      const productInfo = request.only(['name', 'price'])

      const product = new Product()
      product.name = productInfo.name
      product.price = productInfo.price

      await product.save()

      return response.status(201).json(product)
    } catch (e) {
      return response.json({message: 'Something wrong happend. Try again'})
    }
  }

  async update ({params, request, response}) {
    const productInfo = request.only(['name', 'price'])

    const product = await Product.find(params.id)
    if (!product) {
      return response.status(404).json({data: 'Resource not found'})
    }
    product.name = productInfo.name
    product.price = productInfo.price

    await product.save()

    return response.status(200).json(product)
  }

  async delete ({params, response}) {
    const product = await Product.find(params.id)
    if (!product) {
      return response.status(404).json({data: 'Resource not found'})
    }
    await product.delete()

    return response.status(204).json(null)
  }
}

module.exports = ProductController
