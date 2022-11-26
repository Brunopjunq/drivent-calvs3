import { prisma } from "@/config";

async function getHotels() {
  return prisma.hotel.findMany();
}

const hotelsRepository = {
  getHotels
};

export default hotelsRepository;
