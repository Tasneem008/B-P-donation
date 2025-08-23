// services/notificationService.js
class NotificationService {
  static instance;
  constructor(io) { this.io = io; }
  static initialize(io) {
    if (!this.instance) this.instance = new NotificationService(io);
    return this.instance;
  }
  static getInstance() {
    if (!this.instance) throw new Error("NotificationService not initialized");
    return this.instance;
  }
  notifyUser(userId, event, payload) {
    console.log(`Emitting ${event} → room ${userId}`, payload);
    this.io.to(userId).emit(event, payload);
  }
}
module.exports = NotificationService;
