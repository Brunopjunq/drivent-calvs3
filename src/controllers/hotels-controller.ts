import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";
import { Hotel } from "@prisma/client";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels: Hotel[] = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    if(error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if(error.name === "PaymentRequired") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  try {
    const rooms = await hotelsService.getHotelRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if(error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    if(error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if(error.name === "PaymentRequired") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
