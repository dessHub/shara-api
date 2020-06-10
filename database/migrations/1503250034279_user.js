'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone', 15).notNullable().unique()
      table.string('role', 254).notNullable().defaultTo('normal')
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.dropIfExists('users')
  }
}

module.exports = UserSchema
