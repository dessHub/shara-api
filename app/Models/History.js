'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class History extends Model {

  static boot () {
    super.boot()
  }

  static get table() {
    return 'histories'
  }

  static get primaryKey() {
    return 'id'
  }

  order() {
    return this.belongsTo('App/Models/Order')
  }

  product() {
    return this.belongsTo('App/Models/Product')
  }
}

module.exports = History
