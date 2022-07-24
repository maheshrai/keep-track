import type { User, TimelineEvent } from "@prisma/client";

import { prisma } from "~/db.server";

export type { TimelineEvent } from "@prisma/client";



export function createEvent({
  description,
  timestamp,
  notes,
  trackItemId,
}: Pick<TimelineEvent, "description" | "timestamp" | "notes" | "trackItemId">) {
  return prisma.timelineEvent.create({
    data: {
      description,
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

