import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, Link, Outlet, NavLink } from "@remix-run/react";
import { TimeLike } from "fs";
import invariant from "tiny-invariant";
import { deleteEvent, TimelineEvent } from "~/models/event.server";

import { deleteItem } from "~/models/item.server";
import { getItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  const item = await getItem({ userId, id: params.itemId });
  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ item: item });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);

  let formData = await request.formData();
  switch (formData.get("action")) {
    case "deleteitem": {
      invariant(params.itemId, "itemId not found");

      await deleteItem({ userId, id: params.itemId });

      return redirect("/items");  
    }
    case "deleteevents":{
      for (var [key, value] of formData.entries()) { 
        if(key === "action") {
          continue;
        }
        invariant(value, "Invalid data");
        await deleteEvent({ userId, id: value.toString() });
      }      
      return redirect("/items/" + params.itemId );
    }
  }
  invariant(params.itemId, "itemId not found");

  await deleteItem({ userId, id: params.itemId });

  return redirect("/items");
}

export default function ItemDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.item.name}</h3>
      <p className="py-6">{data.item.category}</p>
      <hr className="my-4" />
      <Form method="post">
        <input type="hidden" name="action" value="deleteitem" />
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete item
        </button>
        &nbsp; &nbsp;
        <Link to="new">
          <button className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
            Add an event
          </button>
        </Link>
      </Form>
      <hr className="my-4" />
      <h1 className="text-xl">Events</h1>
      <br></br>
      <Outlet />
        {data.item.timelineEvents.length === 0 ? (
            <p >No events found</p>
          ) : (
            <Form method="post">
              <input type="hidden" name="action" value="deleteevents" />
              <ol>
                {data.item.timelineEvents.sort(compareTimestamps).map((item) => (
                  <div key={item.id} className="flex items-center">
                      <input id={item.id} name={item.id} type="checkbox" value={item.id} className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300">{new Date(item.timestamp).toLocaleDateString()} - {item.notes}</label>
                  </div>
                ))}
              </ol>
              <br></br>
              <button
                type="submit"
                className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
              >
                Delete events
              </button>
            </Form>
          )}
    </div>
  );
}

function compareTimestamps(a: any, b: any) {
  let x = new Date(a.timestamp) ;
  let y = new Date(b.timestamp) ;
  return y.getTime() - x.getTime();
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Item not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
