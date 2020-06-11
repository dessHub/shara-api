'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

  static boot () {
    super.boot()
  }

  static get table() {
    return 'orders'
  }

  static get primaryKey() {
    return 'id'
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  histories () {
    return this.hasMany('App/Models/History')
  }
}

module.exports = Order
