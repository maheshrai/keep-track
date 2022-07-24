import { Link } from "@remix-run/react";

export default function ItemIndexPage() {
  return (
    <p>
      No item selected. Select an intem on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new item.
      </Link>
    </p>
  );
}
