import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createEvent } from "~/models/event.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const description = formData.get("description");
  const timestamp = Date.parse("07/24/2022");// formData.get("timestamp");
  const notes = formData.get("notes");

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Description is required", category: null } },
      { status: 400 }
    );
  }

  if (typeof timestamp !== "object") {
    return json(
      { errors: { description: null, timestamp: "Timestamp is required" } },
      { status: 400 }
    );
  }

  const item = await createEvent({ description: description, timestamp: timestamp, notes: "", trackItemId:  ''});

  return redirect(`/items`);
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const timestampRef = React.useRef<HTMLInputElement>(null);
  const notesRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } 
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <input
            ref={descriptionRef}
            name="description"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.description}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Timestamp: </span>
          <input 
           type="date"
            ref={timestampRef}
            name="timestamp"
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Notes: </span>
          <textarea
            ref={notesRef}
            name="category"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
