import type { User, TrackItem } from "@prisma/client";

import { prisma } from "~/db.server";

export type { TrackItem } from "@prisma/client";

export function getItem({
  id,
  userId,
}: Pick<TrackItem, "id"> & {
  userId: User["id"];
}) {
  return prisma.trackItem.findFirst({
    select: { id: true, name: true, category: true },
    where: { id, userId },
  });
}

export function getItemList({ userId }: { userId: User["id"] }) {
  return prisma.trackItem.findMany({
    where: { userId },
    select: { id: true, name: true, category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createItem({
  name,
  category,
  userId,
}: Pick<TrackItem, "name" | "category"> & {
  userId: User["id"];
}) {
  return prisma.trackItem.create({
    data: {
      name,
      category,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteItem({
  id,
  userId,
}: Pick<TrackItem, "id"> & { userId: User["id"] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
