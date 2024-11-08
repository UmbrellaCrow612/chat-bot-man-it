import React, { useState, useCallback, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { Button } from '@/components/ui/button'

const randomResponses = [
  "That's an interesting question about our 3D printers!",
  "I'd be happy to provide more information about our product line.",
  "Our 3D printers are known for their high quality and reliability.",
  "We offer a range of 3D printers suitable for both beginners and professionals.",
  "Jone Jones 3D Printers are at the forefront of additive manufacturing technology.",
  "Our customer support team is always ready to assist with any queries.",
  "We have models that are perfect for home use and others for industrial applications.",
  "3D printing opens up a world of creative possibilities!",
  "Our printers come with user-friendly software for easy operation.",
  "We offer comprehensive training and support for all our 3D printer models."
]

const multipleChoiceOptions = [
  "Tell me about your most popular 3D printer model.",
  "What materials can your 3D printers use?",
  "Do you offer any discounts for educational institutions?",
  "Can you explain the difference between FDM and SLA printers?",
  "What kind of customer support do you provide?"
]

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Welcome to Jone Jones 3D Printers! How can I assist you today?" },
    { id: 2, sender: 'user', text: "Hi, I'm interested in your 3D printers." },
  ])
  const [input, setInput] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const getRandomResponses = useCallback(() => {
    const shuffled = [...randomResponses].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 2)
  }, [])

  const getRandomOptions = useCallback(() => {
    const shuffled = [...multipleChoiceOptions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }, [])

  const handleSend = useCallback((text: string) => {
    setMessages(prev => [...prev, { id: prev.length + 1, sender: 'user', text }])
    setInput('')
    setShowOptions(false)
    
    // Send 2 random messages and then show options
    getRandomResponses().forEach((response, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: response }])
        if (index === 1) {
          setShowOptions(true)
        }
      }, (index + 1) * 1000) // Stagger responses by 1 second each
    })
  }, [getRandomResponses])

  const handleOptionClick = useCallback((option: string) => {
    handleSend(option)
  }, [handleSend])

  useEffect(() => {
    const scrollArea = document.querySelector('.scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] max-w-md mx-auto border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Jone Jones 3D Printers Chat</h1>
      </div>
      <ScrollArea className="flex-grow p-4 scroll-area">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {showOptions && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Choose an option or type your own question:</p>
            {getRandomOptions().map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2 w-full text-left justify-start"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          />
          <Button onClick={() => handleSend(input)}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}