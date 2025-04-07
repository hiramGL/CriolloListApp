"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/EmptyState"
import MessageCard from "@/components/ui/MessageCard"
import ChatWindow from "@/components/ui/ChatWindow"

export default function MessagesPage() {
  const router = useRouter()

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Michael Santiago",
      message: "Hey, I saw your logo design offer!",
      timestamp: "10:24 AM",
    },
    {
      id: 2,
      name: "Sara Vega",
      message: "Can you do social media banners?",
      timestamp: "Yesterday",
    },
  ])

  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    conversations.length > 0 ? conversations[0].id : null
  )

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-gray-900">
      {/* Home Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="rounded-xl px-4 py-2 text-sm"
          onClick={() => router.push("/")}
        >
          Home
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Left Panel – Conversation List */}
          <div className="space-y-3 sm:col-span-1">
            {conversations.map((chat) => (
              <div key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                <MessageCard
                  name={chat.name}
                  message={chat.message}
                  timestamp={chat.timestamp}
                />
              </div>
            ))}
          </div>

          {/* Right Panel – Chat Window */}
          <div className="sm:col-span-2">
            <ChatWindow />
          </div>
        </div>
      )}
    </main>
  )
}
