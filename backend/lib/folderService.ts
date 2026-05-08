import { prisma } from "./prisma";

export const folderService = {
  async getFolders(userId: string) {
    return prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { snippets: true },
        },
      },
    });
  },

  async getFolderById(id: string, userId: string) {
    return prisma.folder.findFirst({
      where: { id, userId },
      include: {
        snippets: true,
      },
    });
  },

  async createFolder(userId: string, data: { name: string }) {
    return prisma.folder.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async updateFolder(id: string, userId: string, data: { name?: string }) {
    const folder = await prisma.folder.findFirst({
      where: { id, userId },
    });
    if (!folder) return null;

    return prisma.folder.update({
      where: { id },
      data,
    });
  },

  async deleteFolder(id: string, userId: string) {
    const folder = await prisma.folder.findFirst({
      where: { id, userId },
    });
    if (!folder) return null;

    await prisma.folder.delete({
      where: { id },
    });
    return true;
  },
};
