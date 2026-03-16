// database/models/BotSession.js

export default class BotSession {
  constructor(numero, sessionData) {
    this.numero = numero
    this.sessionData = sessionData
    this.createdAt = new Date()
  }
}
