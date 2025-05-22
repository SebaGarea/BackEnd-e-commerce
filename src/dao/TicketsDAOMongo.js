import { TicketModel } from "./models/ticket.model.js";

export class TicketsDAOMongo {
  static async create(ticketData) {
    try {
      const ticket = await TicketModel.create(ticketData);
      return ticket;
    } catch (error) {
      throw new Error(`Error al crear el ticket en DB: ${error.message}`);
    }
  }
}