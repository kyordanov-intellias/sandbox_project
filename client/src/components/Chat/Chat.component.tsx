import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '../../context/UserContext';
import './Chat.styles.css';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderInfo: {
        username: string;
        profileImage?: string;
    };
    createdAt: string;
}

interface SystemMessage {
    type: 'join' | 'leave';
    username: string;
    timestamp: string;
}

interface Room {
    id: number;
    name: string;
}

const EditIcon = () => <span role="img" aria-label="edit">✏️</span>;
const DeleteIcon = () => <span role="img" aria-label="delete">🗑️</span>;
const RoomIcon = () => <span role="img" aria-label="room">💬</span>;
const WelcomeIcon = () => <span role="img" aria-label="wave">👋</span>;

export const Chat = () => {
    const [messages, setMessages] = useState<(Message | SystemMessage)[]>([]);
    const [message, setMessage] = useState('');
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editMessageContent, setEditMessageContent] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);


    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:4004/chat/rooms');
                if (response.ok) {
                    const data = await response.json();
                    setRooms(data);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);

    const fetchMessageHistory = async (roomId: number) => {
        try {
            const response = await fetch(`http://localhost:4004/chat/rooms/${roomId}/messages`);
            if (response.ok) {
                const history = await response.json();
                setMessages(history);
            }
        } catch (error) {
            console.error('Error fetching message history:', error);
        }
    };

    const handleEditMessage = (messageId: string, currentContent: string) => {
        setEditingMessageId(messageId);
        setEditMessageContent(currentContent);
    };

    const handleSaveEdit = async (messageId: string) => {
        try {
            const response = await fetch(`http://localhost:4004/chat/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content: editMessageContent }),
            });

            if (response.ok) {
                setMessages(prev => prev.map(msg => {
                    if ('id' in msg && msg.id === messageId) {
                        return { ...msg, content: editMessageContent };
                    }
                    return msg;
                }));
                setEditingMessageId(null);
                setEditMessageContent('');
            } else {
                const errorData = await response.json();
                console.error('Error updating message:', errorData);
                alert('Error updating message: ' + (errorData.error || response.statusText));
            }
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const response = await fetch(`http://localhost:4004/chat/messages/${messageId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setMessages(prev => prev.filter(msg => !('id' in msg) || msg.id !== messageId));
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    useEffect(() => {
        if (!user) return;

        socketRef.current = io('http://localhost:4004', {
            withCredentials: true,
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to chat server');
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from chat server');
            setIsConnected(false);
        });

        socketRef.current.on('message_received', (newMessage: Message) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        socketRef.current.on('user_joined', (data: { userId: string; username: string }) => {
            setMessages((prev) => [...prev, {
                type: 'join',
                username: data.username,
                timestamp: new Date().toISOString()
            }]);
        });

        socketRef.current.on('user_left', (data: { userId: string; username: string }) => {
            setMessages((prev) => [...prev, {
                type: 'leave',
                username: data.username,
                timestamp: new Date().toISOString()
            }]);
        });

        socketRef.current.on('message_deleted', ({ messageId }) => {
            setMessages(prev => prev.filter(msg => !('id' in msg) || msg.id !== messageId));
        });

        socketRef.current.on('message_edited', ({ messageId, content }) => {
            setMessages(prev =>
                prev.map(msg =>
                    'id' in msg && msg.id === messageId
                        ? { ...msg, content }
                        : msg
                )
            );
        });

        socketRef.current.on('error', (error: Error) => {
            console.error('Socket error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = async (room: Room) => {
        if (socketRef.current && user) {
            const username = `${user.profile?.firstName} ${user.profile?.lastName}`;
            socketRef.current.emit('join_room', room.id, username);
            setCurrentRoom(room);
            setIsConnected(true);
            await fetchMessageHistory(room.id);
        }
    };

    const leaveRoom = () => {
        if (socketRef.current && currentRoom) {
            socketRef.current.emit('leave_room', currentRoom.id);
            setCurrentRoom(null);
            setIsConnected(false);
            setMessages([]);
        }
    };

    const sendMessage = () => {
        if (socketRef.current && message.trim() && currentRoom && user) {
            const messageData = {
                content: message,
                roomId: currentRoom.id,
                senderId: user.id,
                senderInfo: {
                    username: `${user.profile?.firstName} ${user.profile?.lastName}`,
                    profileImage: user.profile?.profileImage
                }
            };

            socketRef.current.emit('send_message', messageData);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.message-actions')) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (!user) {
        return <div className="chat-container">Please log in to use the chat</div>;
    }

    return (
        <div className="chat-container chat-bg">
            <div className="room-controls room-controls-fancy">
                {!isConnected ? (
                    <div className="welcome-area">
                        <div className="welcome-icon"><WelcomeIcon /></div>
                        <h2>Welcome to the Chat!</h2>
                        <p>Select a room to join:</p>
                        <div className="room-list">
                            {rooms.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => joinRoom(room)}
                                    className="room-button join-button room-button-fancy"
                                >
                                    <RoomIcon /> {room.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="room-status">
                        <span className="status-indicator connected"></span>
                        <span><RoomIcon /> Connected to <b>{currentRoom?.name}</b></span>
                        <button
                            onClick={leaveRoom}
                            className="room-button leave-button"
                        >
                            Leave Room
                        </button>
                    </div>
                )}
            </div>

            {isConnected && (
                <div className="messages-container messages-animated">
                    {messages.map((msg, index) => {
                        if ('type' in msg) {
                            return (
                                <div key={index} className="system-message system-message-fancy">
                                    <span className="system-icon">🔔</span> {msg.username} has {msg.type === 'join' ? 'joined' : 'left'} the chat
                                    <div className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            );
                        }

                        const isOwnMessage = msg.senderId === user.id;
                        const isEditing = editingMessageId === msg.id;

                        return (
                            <div key={msg.id} className={`message message-animated ${isOwnMessage ? 'own-message' : ''}`}>
                                <div className="message-header">
                                    <img
                                        src={msg.senderInfo.profileImage || '/default-avatar.png'}
                                        alt={msg.senderInfo.username}
                                        className="message-avatar"
                                    />
                                    <div className="message-content">
                                        <div className="message-username">
                                            {msg.senderInfo.username}
                                            {isOwnMessage && <span className="you-badge">You</span>}
                                        </div>
                                        {isEditing ? (
                                            <div className="edit-message-container">
                                                <input
                                                    type="text"
                                                    value={editMessageContent}
                                                    onChange={(e) => setEditMessageContent(e.target.value)}
                                                    className="edit-message-input"
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(msg.id)}
                                                    className="save-edit-button"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingMessageId(null);
                                                        setEditMessageContent('');
                                                    }}
                                                    className="cancel-edit-button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="message-text">{msg.content}</div>
                                        )}
                                        <div className="message-time">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    {isOwnMessage && !isEditing && (
                                        <div className="message-actions">
                                            <button
                                                className="message-actions-button"
                                                onClick={() => setOpenDropdownId(openDropdownId === msg.id ? null : msg.id)}
                                            >
                                                ⋮
                                            </button>
                                            {openDropdownId === msg.id && (
                                                <div className="message-actions-menu message-actions-menu-fancy">
                                                    <button onClick={() => { setOpenDropdownId(null); handleEditMessage(msg.id, msg.content); }}>
                                                        <EditIcon /> Edit
                                                    </button>
                                                    <button onClick={() => { setOpenDropdownId(null); handleDeleteMessage(msg.id); }}>
                                                        <DeleteIcon /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {isConnected && (
                <div className="input-container input-container-fancy">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        className="send-button send-button-fancy"
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};
