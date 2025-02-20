"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { LoadingState } from "./loading-state"

interface TerminalInterfaceProps {
  output: string[]
  isProcessing: boolean
  onCommand: (command: string) => void
}

export function TerminalInterface({ output, isProcessing, onCommand }: TerminalInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
    inputRef.current?.focus()
  }, [outputRef, inputRef])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isProcessing) {
      const command = e.currentTarget.value.trim()
      if (command) {
        onCommand(command)
        e.currentTarget.value = ""
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-auto font-mono text-[#F0B90B] text-sm p-6 space-y-2"
        style={{
          background: "linear-gradient(to bottom, rgba(10, 26, 47, 0.9), rgba(0, 0, 0, 0.9))",
          boxShadow: "inset 0 0 30px rgba(240, 185, 11, 0.1)",
        }}
      >
        {output.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
        {isProcessing && (
          <div className="flex items-center space-x-2">
            <LoadingState />
            <span className="text-[#F0B90B]/80">Processing quantum calculations...</span>
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="border-t-2 border-[#F0B90B]/30 bg-[#0A1A2F]/60">
        <div className="flex items-center p-4">
          <span className="text-[#F0B90B] mr-2 font-bold">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#F0B90B] font-mono placeholder-[#F0B90B]/50"
            placeholder="Enter command... (type /start for available commands)"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

