import { forbiddenError, notFoundError, paymentRequiredError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);

  if(!enrollment) {
    throw notFoundError();
  }

  if(!ticket) {
    throw unauthorizedError();
  }

  if(!payment) {
    throw paymentRequiredError();
  }

  if(ticket.TicketType.isRemote) {
    throw forbiddenError();
  }

  if(!ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const hotels = await hotelsRepository.getHotels();

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);

  if(!enrollment) {
    throw notFoundError();
  }

  if(!ticket) {
    throw unauthorizedError();
  }

  if(!payment) {
    throw paymentRequiredError();
  }

  if(ticket.TicketType.isRemote) {
    throw forbiddenError();
  }

  if(!ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const rooms = await hotelsRepository.getHotelRooms(hotelId);

  if(!rooms) {
    throw notFoundError();
  }

  return rooms;
}

const hotelsService = {
  getHotels,
  getHotelRooms
};

export default hotelsService;
