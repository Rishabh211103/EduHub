import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { ChatApi } from '../apiConfig'

function Sidebar() {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.users)
    const { sessionId } = useParams()
    const { data: chats, isError: chatsError, refetch } = useQuery({
        queryKey: ['chats', user.id],
        queryFn: () => ChatApi.getUserChatSessions(user.id),
        retry: 0
    })

    const handleChatSelection = (sessionId) => {
        navigate(`/student/chat/${sessionId}`)
    }

    const groupChatsByDate = (chats) => {
        if (!chats || chats.length === 0) return {}

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastMonth = new Date(today)
        lastMonth.setDate(lastMonth.getDate() - 30)

        const groups = {
            Today: [],
            Yesterday: [],
            'Last 7 Days': [],
            'Last 30 Days': [],
            Older: []
        }

        chats.forEach(chat => {
            const chatDate = new Date(chat.createdAt)
            const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

            if (chatDay.getTime() === today.getTime()) {
                groups.Today.push(chat)
            } else if (chatDay.getTime() === yesterday.getTime()) {
                groups.Yesterday.push(chat)
            } else if (chatDay >= lastWeek) {
                groups['Last 7 Days'].push(chat)
            } else if (chatDay >= lastMonth) {
                groups['Last 30 Days'].push(chat)
            } else {
                groups.Older.push(chat)
            }
        })

        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) {
                delete groups[key]
            }
        })

        return groups
    }

    return (
        <div className="drawer-side z-20">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="bg-base-100 min-h-full w-80 p-4 flex flex-col">
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-2">Previous Chats</h2>
                    <div className="divider my-2"></div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chatsError ? (
                        <div className="text-center text-error text-sm py-4">
                            Failed to load chats
                        </div>
                    ) : !chats || chats?.sessions.length === 0 ? (
                        <div className="text-center text-base-content/60 text-sm py-4">
                            No previous chats
                        </div>
                    ) : (
                        <ul className="menu bg-base-100 w-full">
                            {Object.entries(groupChatsByDate(chats.sessions)).map(([dateGroup, groupChats]) => (
                                <li key={dateGroup}>
                                    <h2 className="menu-title">{dateGroup}</h2>
                                    <ul>
                                        {groupChats.map((chat) => (
                                            <li key={chat._id}>
                                                <a
                                                    onClick={() => handleChatSelection(chat._id)}
                                                    className={`${sessionId === chat._id ? 'border border-primary' : ''}`}
                                                >
                                                    <div className="flex flex-col items-start w-full overflow-hidden">
                                                        <div className="font-medium truncate w-full">
                                                            {chat.title || 'Untitled Chat'}
                                                        </div>
                                                        <div className="text-xs opacity-60 truncate w-full">
                                                            {new Date(chat.createdAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-base-300">
                    <button className="btn btn-outline btn-sm w-full" onClick={() => refetch()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar