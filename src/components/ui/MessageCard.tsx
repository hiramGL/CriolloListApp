// components/MessageCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface MessageCardProps {
  name: string
  message: string
  timestamp: string
  avatarUrl?: string
}

export default function MessageCard({ name, message, timestamp, avatarUrl }: MessageCardProps) {
  return (
    <Card className="rounded-xl shadow-md p-3 hover:shadow-lg transition-all cursor-pointer">
      <CardContent className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100">
          <Image src={avatarUrl} alt={name} width={40} height={40} className="object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600 truncate">{message}</p>
        </div>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </CardContent>
    </Card>
  )
}
