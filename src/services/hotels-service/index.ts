import { invalidDataError, notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";

async function checkUser(userId: number) {
  const user = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!user) {
    throw unauthorizedError();
  }

  return user.id;
}

async function getHotels(userId: number): Promise<Hotel[]> {
  const user = await checkUser(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(user);

  if (!ticket) {
    throw notFoundError();
  }

  if(!ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }

  if(!ticket.TicketType.includesHotel) {
    throw unauthorizedError();
  }

  if(ticket.status === "RESERVED") {
    throw invalidDataError;
  }

  return hotelsRepository.getHotels();
}

const hotelsService = {
  getHotels
};

export default hotelsService;
