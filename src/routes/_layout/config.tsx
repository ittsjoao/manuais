import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/config')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/config"!</div>
}
