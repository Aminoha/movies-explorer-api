module.exports = class NotPermission extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
