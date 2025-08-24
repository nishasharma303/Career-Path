"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

type Message = {
  content: string
  role: 'user' | 'assistant'
  type: 'text' | 'loading'
}

const AiChat = () => {
  const [userInput, setUserInput] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [messageList, setMessageList] = useState<Message[]>([])
  const { chatid }:any = useParams();
  const router = useRouter();
  console.log(chatid);

  useEffect(() => {
    chatid && GetMessageList();
  }, [chatid])

  const GetMessageList= async() => {
    const result = await axios.get('/api/history?recordId='+chatid);
    console.log(result.data);
    setMessageList(result?.data?.content);
  }

  const onSend = async () => {
    if (!userInput.trim() || loading) return

    setLoading(true)

    const userMessage: Message = { content: userInput, role: 'user', type: 'text' }
    const loadingMessage: Message = { content: '', role: 'assistant', type: 'loading' }
    setMessageList(prev => [...prev, userMessage, loadingMessage])
    setUserInput('')

    try {
      const { data } = await axios.post('/api/ai-career-chat-agent', { userInput })

      // Backend returns AI response directly
      const aiResponse = data?.aiResponse || "I couldn't process that request."

      setMessageList(prev => [
        ...prev.slice(0, -1), // remove loading message
        { content: aiResponse, role: 'assistant', type: 'text' }
      ])
    } catch (error) {
      console.error("Error:", error)
      setMessageList(prev => [
        ...prev.slice(0, -1),
        { content: "Sorry, I encountered an error. Please try again.", role: 'assistant', type: 'text' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    //save mssgs into databse
    messageList.length>0 && updateMessageList();

  }, [messageList])

  const updateMessageList=async() =>{
    const result=await axios.put('/api/history', {
      content: messageList,
      recordId: chatid
    });
    console.log(result);
  }

  const onNewChat =async ()=>{
    const id= uuidv4();
    //create new record to history table
    const result = await axios.post('/api/history', {
      recordId:id,
      content:[]
    });
    console.log(result);
    router.replace("/ai-tools/ai-chat/"+id);
  }

  return (
    <div className='px-10 md:px-24 lg:px-36 xl:px-48'>
      <div className='flex items-center justify-between mb-4 gap-8'>
        <div>
          <h2 className='font-bold text-lg'>AI Career Q/A Chat</h2>
          <p className='text-gray-600'>Smarter career decisions start here — get tailored advice, real-time market insights</p>
        </div>
        <Button onClick={onNewChat}>+ New Chat</Button>
      </div>

      <div className='flex flex-col h-[75vh]'>
        {messageList.length === 0 && (
          <div className='mt-5'>
            <EmptyState selectedQuestion={(question: string) => setUserInput(question)} />
          </div>
        )}

        <div className='flex-1 overflow-y-auto mb-4'>
          {messageList.map((message, index) => (
            <div 
  key={index} 
  className={`flex mb-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
>
  <div className={`p-3 rounded-lg max-w-[80%] break-words ${
    message.role === 'user' ? 'bg-gray-300 text-gray-900' : 'bg-gray-100 text-gray-900'
  }`}>
    {message.type === 'loading' ? (
      <LoaderCircle className='animate-spin h-5 w-5' >Thinking..</LoaderCircle>
    ) : (
      <ReactMarkdown>
        {message.content}
      </ReactMarkdown>
    )}
  </div>
</div>
          ))}
        </div>

        <div className='flex items-center justify-between gap-6'>
          <Input 
            placeholder='Type here'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend()}
            disabled={loading}
          />
          <Button onClick={onSend} disabled={loading || !userInput.trim()}>
            {loading ? <LoaderCircle className='animate-spin h-5 w-5' /> : <Send className='h-5 w-5' />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AiChat
