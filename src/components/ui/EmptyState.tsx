import Image from "next/image"

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <Image
        src="/no-messages-illustration.png"
        alt="No messages"
        width={150}
        height={150}
        className="mb-6"
      />
      <h2 className="text-xl font-semibold text-gray-800">No messages yet</h2>
      <p className="text-gray-600 text-sm mt-2 max-w-sm">
        When someone contacts you about your service, their messages will show up here.
      </p>
    </div>
  )
}
