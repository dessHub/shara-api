# Shara API application

This is a simple api that allows a user to register, login and create orders consisting of multiple products. The application sends an email and SMS notification to the user for each order they create with details of the items selected.


## Setup

1. Use the adonis command to install the blueprint

```bash
git clone https://github.com/dessHub/shara-api.git
cd shara-api
npm install
```

2. Copy `.env.sample` to `.env` and update the environment variables

3. Run the following command to run startup migrations.

```js
adonis migration:run
```

4. Seed the database to create admin user

```
adonis seed
```

5. Start the server

```
adonis serve --dev
```

**API features**
* Signup and Login
* Creating products by admin
* Orders creations

**Endpoints exposed by the API**


Endpoint                    |  Functionality
 ------------------------   |   ------------------------ 
GET /register               | normal user registration
GET /login                  | user authentication with jwt.
POST /products              | create products by admin
DELETE /products/:id        | delete product with the given id
PUT /products/:id           | update product with the given id
GET /products/:id           | retrieves product with the given id
GET /admin/orders           | get all the orders (admin)
GET /admin/orders/:id       | get specific order with the given id (admin)
GET /orders                 | get all user's orders
GET /orders/:id             | get specific order with the given id belonging to a user
POST /orders                | creates orders
DELETE /orders/:id          | delete sms with the given id (not implemented)


**Endpoint payload**

* POST /register
```
{
  "name": "name",
  "phone": "phone number",
  "email": "email",
  "password": "password"
}
```

* POST /login
```
{
  "email": "email",
  "password": "password"
}
```

* POST /products

```
{
  "name": "Product name",
  "price": 246
}
```


* POST /orders

```
{
	"amount": 250,
	"noProducts": 1,
	"products": [
		{
			"product_id": 2,
			"quantity": 2
		},
		{
			"product_id": 3,
			"quantity": 4
		}
	]
}
```
