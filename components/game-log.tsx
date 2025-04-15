"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GameLogProps {
  logs: string[]
}

export function GameLog({ logs }: GameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <Card className="border border-green-700 bg-green-900/40 shadow-md">
      <CardContent className="p-0.5">
        <ScrollArea className="h-[60px] w-full rounded-sm pr-2">
          <div ref={scrollRef} className="space-y-0.5">
            {logs.length === 0 ? (
              <p className="text-center text-[8px] text-green-500">Game started. Good luck!</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`rounded px-1 py-0.25 text-[8px] ${
                    log.startsWith("AI") ? "bg-red-900/30 text-red-200" : "bg-green-900/30 text-green-200"
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
