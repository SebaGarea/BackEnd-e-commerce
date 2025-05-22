import { TicketsDAOMongo as TicketsDAO } from "../dao/TicketsDAOMongo.js";

class TicketsService {
  async createTicket(ticketData) {
    return await TicketsDAO.create(ticketData);
  }
}

export const ticketsService = new TicketsService();