'use strict'

const { validateAll } = use('Validator');
const User = use('App/Models/User')

class AuthController {

  async register({request, auth, response}) {

    const rules = {
      email: 'required|email|unique:users,email',
      name: 'required',
      phone: 'required|unique:users,phone',
      password: 'required'
    };

    const { email, name, phone, password } = request.only([
      'email',
      'name',
      'password',
      'phone'
    ]);

    const validation = await validateAll(request.all(), rules);

    if (!validation.fails()) {
      try {
        const user = await User.create({ email, name, phone, password });
        //generate token for user;
        let token = await auth.generate(user)

        Object.assign(user, token)

        return response.json(user)
      } catch (err) {
        response.status(401).send({ error: 'Please try again' });
      }
    } else {
      response.status(401).send(validation.messages());
    }
  }

  async login({request, auth, response}) {

    const rules = {
      email: 'required|email',
      password: 'required'
    };

    let {email, password} = request.all();

    const validation = await validateAll({ email, password }, rules);

    if (!validation.fails()) {
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let token = await auth.generate(user)

        Object.assign(user, token)
        return response.json(user)
      }

    }
    catch (e) {
      console.log(e)
      return response.status(401).json({message: 'You are not registered!'})
    }
    } else {
      response.status(401).send(validation.messages());
    }
  }
}

module.exports = AuthController
