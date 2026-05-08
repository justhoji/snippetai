import { prisma } from "./prisma";

export const tagService = {
  async getTags(userId: string) {
    return prisma.tag.findMany({
      where: {
        snippets: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            snippets: {
              where: { userId },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async getTagByName(name: string, userId: string) {
    return prisma.tag.findUnique({
      where: { name },
      include: {
        snippets: {
          where: { userId },
          include: {
            folder: true,
          },
        },
      },
    });
  },

  async upsertTag(name: string) {
    return prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  },
};
