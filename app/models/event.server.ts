import type { User, TimelineEvent } from "@prisma/client";

import { prisma } from "~/db.server";

export type { TimelineEvent } from "@prisma/client";



export function createEvent({
  timestamp,
  notes,
  trackItemId,
}: Pick<TimelineEvent, "timestamp" | "notes" | "trackItemId">) {
  return prisma.timelineEvent.create({
    data: {
      timestamp,
      notes,
      trackItem: {
        connect: {
          id: trackItemId,
        },
      },
    },
  });
}

export function deleteEvent({
  id,
}: Pick<TimelineEvent, "id"> & { userId: User["id"] }) {
  return prisma.timelineEvent.delete({
    where: { id },
  });
}
