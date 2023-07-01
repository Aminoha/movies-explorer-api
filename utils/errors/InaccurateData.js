module.exports = class InaccurateData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
