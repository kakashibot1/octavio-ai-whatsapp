// database/models/User.js

export default class User {
  constructor(numero, code) {
    this.numero = numero
    this.code = code
    this.activatedAt = new Date()
  }
      }
