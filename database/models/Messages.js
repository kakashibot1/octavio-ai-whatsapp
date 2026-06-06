// database/models/Messages.js

export default class Messages {
  constructor(from, text) {
    this.from = from;
    this.text = text;
    this.receivedAt = new Date();
  }
}
