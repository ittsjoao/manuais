import { createFileRoute } from "@tanstack/react-router";
import Tiptap from "@/components/Tiptap";

export const Route = createFileRoute("/_layout/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Tiptap />;
}
