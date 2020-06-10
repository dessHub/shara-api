'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')

  Route.post('products', 'ProductController.store').middleware('authAdmin')
  Route.get('products', 'ProductController.index')
  Route.get('products/:id', 'ProductController.show').middleware('authAdmin')
  Route.put('products/:id', 'ProductController.update').middleware('authAdmin')
  Route.delete('products/:id', 'ProductController.delete').middleware('authAdmin')


}).prefix('api/v1')
