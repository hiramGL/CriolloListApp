"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/clients"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/EmptyState"
import MessageCard from "@/components/ui/MessageCard"
import ChatWindow from "@/components/ui/ChatWindow"

// Simple loading spinner component
function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>
  )
}

export default function MessagesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true) // New loading state

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data, error } = await supabase
        .from("conversations")
        .select("id, participant_1, participant_2")
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)

      if (error) {
        console.error("Error fetching conversations:", error)
        return
      }

      const enriched = await Promise.all(data.map(async (conv) => {
        const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1
        const { data: userInfo } = await supabase
          .from("users")
          .select("full_name, profile_image")
          .eq("id", otherId)
          .single()

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        return {
          id: conv.id,
          name: userInfo?.full_name ?? "Unknown",
          message: lastMsg?.content ?? "No messages yet",
          profilePicture: userInfo?.profile_image ?? "/profile_pic.png",
          timestamp: lastMsg?.created_at ? new Date(lastMsg.created_at).toLocaleTimeString() : "",
        }
      }))

      setConversations(enriched)
      setSelectedChatId(searchParams.get("conversationId") || enriched[0]?.id || null)
      setLoading(false) // Stop loading once data is ready
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedChatId) return

    let subscription: ReturnType<typeof supabase.channel> | null = null

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedChatId)
        .order("created_at", { ascending: true })

      if (!error) setMessages(data)
    }

    fetchMessages()

    subscription = supabase
      .channel(`realtime-messages-${selectedChatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedChatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [selectedChatId])

  const handleSendMessage = async (text: string) => {
    if (!userId || !selectedChatId || text.trim() === "") return

    await supabase.from("messages").insert([
      {
        conversation_id: selectedChatId,
        sender_id: userId,
        content: text,
      },
    ])
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-gray-900">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="rounded-xl px-4 py-2 text-sm"
          onClick={() => router.push("/")}
        >
          Home
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-green-500">Messages</h1>

      {loading ? (
        <Spinner />
      ) : conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-3 sm:col-span-1">
            {conversations.map((chat) => (
              <div key={chat.id} onClick={() => setSelectedChatId(chat.id)}>
                <MessageCard
                  name={chat.name}
                  message={chat.message}
                  timestamp={chat.timestamp}
                  avatarUrl={chat.profilePicture}
                />
              </div>
            ))}
          </div>
          <div className="sm:col-span-2">
            <ChatWindow
              messages={messages}
              onSend={handleSendMessage}
              userId={userId}
            />
          </div>
        </div>
      )}
    </main>
  )
}
