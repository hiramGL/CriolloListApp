// app/messages/page.tsx
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import MessagesClient from "./messagesClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesClient />
    </Suspense>
  )
}
