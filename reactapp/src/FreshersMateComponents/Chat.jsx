import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChatApi } from '../apiConfig'
import Sidebar from './SideBar'
import ReactMarkdown from 'react-markdown'
function ChatWindow() {
    const { user } = useSelector(state => state.users)
    const [sessionId, setSessionId] = useState('')
    const [response, setResponse] = useState([])
    const [prompt, setPrompt] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const chatEndRef = useRef(null)
    const chatContainerRef = useRef(null)

    const { sessionId: chatSessionId, courseId } = useParams()
    const navigate = useNavigate()

    const { data: chatSessionMessage, isLoading: isChatSessionLoading, isError } = useQuery({
        queryKey: ['chats', chatSessionId],
        queryFn: () => ChatApi.getChatSession(chatSessionId),
        enabled: !!chatSessionId,
        refetchOnWindowFocus: false
    })

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        if (chatSessionMessage && chatSessionMessage?.chats) {
            setSessionId(chatSessionMessage.session._id)
            setResponse(chatSessionMessage.chats)
        }
    }, [chatSessionMessage])

    useEffect(() => {
        scrollToBottom()
    }, [response])

    const createSession = async () => {
        try {
            const { session } = await ChatApi.createChatSession({
                userId: user.id,
                title: `New Chat ${sessionId.slice(0, 8)}`
            })
            setSessionId(session._id)
            setResponse([])
            navigate(`/student/chat/${session._id}`)
        } catch (error) {
            console.log(error)
        }
    }

    const sendPrompt = async () => {
        if (!prompt.trim() || !sessionId) return

        const userMessage = prompt
        setPrompt('')
        setIsLoading(true)

        try {
            const res = await ChatApi.handleUserPrompt(sessionId, courseId, { prompt: userMessage })
            setResponse(prev => [...prev, res.message])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendPrompt()
        }
    }


    return (
        <div className="flex flex-col h-screen bg-base-200">
            {/* Header */}
            <div className="navbar bg-base-100 shadow-lg z-10">
                <div className="flex-1">
                    <label htmlFor="my-drawer-3" className="btn btn-ghost btn-circle drawer-button lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <h1 className="text-xl font-bold ml-2">Hello! I’m FreshersMate</h1>

                </div>
                <div className="flex-none gap-2">
                    {sessionId && (
                        <div className="badge badge-primary badge-sm">Session Active</div>
                    )}
                    <button onClick={createSession} className="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Chat
                    </button>
                </div>
            </div>

            <div className='flex flex-1 overflow-hidden'>
                <div className="drawer lg:drawer-open flex-1">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

                    {/* Main Content - Fixed height with flexbox */}
                    <div className="drawer-content flex flex-col h-full relative">
                        {/* Chat Messages Area - This should grow and scroll */}
                        <div ref={chatContainerRef} className="overflow-y-auto p-4 max-h-96">
                            {!sessionId ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">💬</div>
                                        <h2 className="text-2xl font-bold mb-2">Start a New Conversation</h2>
                                        <p className="text-base-content/60 mb-4">Click "New Chat" to begin</p>
                                    </div>
                                </div>
                            ) : response.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">👋</div>
                                        <h2 className="text-2xl font-bold mb-2">How can I help you?</h2>
                                        <p className="text-base-content/60">Ask me anything to get started</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pb-4">
                                    {response.map((item, index) => (
                                        <div key={item._id || index}>
                                            {/* User Message */}
                                            <div className="chat chat-end">
                                                <div className="chat-bubble chat-bubble-primary">
                                                    {item.keyword}
                                                </div>
                                            </div>

                                            {/* AI Response */}
                                            <div className="chat chat-start">
                                                <div className="chat-image avatar">
                                                    <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="text-lg">🤖</span>
                                                    </div>
                                                </div>
                                                <div className="chat-bubble chat-bubble-secondary">
                                                    <ReactMarkdown>{item.response}</ReactMarkdown>
                                                </div>
                                                <div className="chat-footer opacity-50 text-xs mt-1">
                                                    {new Date(item.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                            {/* <div ref={chatEndRef} /> */}
                                        </div>

                                    ))}

                                    {isLoading && (
                                        <div className="chat chat-start">
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-lg">🤖</span>
                                                </div>
                                            </div>
                                            <div className="chat-bubble chat-bubble-secondary">
                                                <span className="loading loading-dots loading-sm"></span>
                                            </div>
                                        </div>
                                    )}
                                    {/* <div ref={chatEndRef} /> */}
                                </div>
                            )}
                        </div>

                        {/* Input Area - Fixed at bottom */}
                        {sessionId && (
                            <div className="p-4 flex-shrink-0 absolute bottom-16 w-10/12 mx-auto">
                                <div className="flex gap-2 max-w-4xl mx-auto">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="input input-bordered flex-1 glass"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={sendPrompt}
                                        className="btn btn-primary"
                                        disabled={!prompt.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}

export default ChatWindow