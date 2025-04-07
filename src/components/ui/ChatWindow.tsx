// components/ChatWindow.tsx
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm interested in your design service.", sender: "them" },
    { id: 2, text: "Awesome! Let me know what you're looking for.", sender: "me" },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim() === "") return
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }])
    setNewMessage("")
  }

  return (
    <Card className="rounded-xl shadow-inner flex flex-col h-full">
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
              msg.sender === "me"
                ? "ml-auto bg-green-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </CardContent>
      <div className="flex items-center gap-2 p-4 border-t bg-white rounded-b-xl">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <Button className="rounded-lg px-4 py-2 text-sm" onClick={handleSend}>
          Send
        </Button>
      </div>
    </Card>
  )
}
