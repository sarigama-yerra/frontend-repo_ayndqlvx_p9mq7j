import { useEffect, useState } from 'react'

export default function Messages({ baseUrl, currentUserId, friends }) {
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (selected) fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const otherId = (fr) => (fr.user_a === currentUserId ? fr.user_b : fr.user_a)

  async function fetchMessages() {
    const other = otherId(selected)
    const res = await fetch(`${baseUrl}/messages?user_a=${currentUserId}&user_b=${other}`)
    const data = await res.json()
    setMessages(data)
  }

  async function send() {
    if (!text.trim()) return
    const other = otherId(selected)
    const res = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: currentUserId, receiver_id: other, content: text })
    })
    if (res.ok) {
      setText('')
      fetchMessages()
    } else {
      alert('Failed to send')
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 space-y-2">
        {friends.filter(f=>f.status==='accepted').map(fr => (
          <button key={fr.id} onClick={() => setSelected(fr)} className={`w-full text-left p-3 border rounded bg-white ${selected?.id===fr.id?'ring-2 ring-blue-500':''}`}>
            {fr.other_user?.username || otherId(fr)}
          </button>
        ))}
      </div>
      <div className="col-span-2 bg-white border rounded p-3 flex flex-col">
        <div className="flex-1 space-y-2 overflow-auto">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[70%] p-2 rounded ${m.sender_id===currentUserId?'ml-auto bg-blue-600 text-white':'bg-gray-100'}`}>
              {m.content}
            </div>
          ))}
        </div>
        {selected ? (
          <div className="mt-3 flex gap-2">
            <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Type a message" />
            <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">Select a friend to start chatting</div>
        )}
      </div>
    </div>
  )
}
