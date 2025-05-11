// components/ChatWindow.tsx
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Message {
  id?: string
  content: string
  sender_id: string
  created_at?: string
}

interface ChatWindowProps {
  messages: Message[]
  userId: string | null
  onSend: (text: string) => void
}

export default function ChatWindow({ messages, userId, onSend }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim() === "") return
    onSend(newMessage)
    setNewMessage("")
  }

  return (
    <Card className="rounded-xl shadow-inner flex flex-col h-[500px]">
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => {
          const isMine = msg.sender_id === userId
          return (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                isMine
                  ? "ml-auto bg-violet-100 text-right"
                  : "mr-auto bg-gray-100 text-left"
              }`}
            >
              {msg.content}
              <div className="text-[10px] text-gray-500 mt-1">
                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ""}
              </div>
            </div>
          )
        })}
      </CardContent>
      <div className="flex items-center gap-2 p-4 border-t bg-white rounded-b-xl">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button className="rounded-lg px-4 py-2 text-sm" onClick={handleSend}>
          Send
        </Button>
      </div>
    </Card>
  )
}
