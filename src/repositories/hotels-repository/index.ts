import { prisma } from "@/config";

async function getHotels() {
  return prisma.hotel.findMany();
}

async function getHotelRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
    include: {
      Hotel: true,
    },
  });  
}

const hotelsRepository = {
  getHotels,
  getHotelRooms
};

export default hotelsRepository;
