import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import Friends from './components/Friends'
import Messages from './components/Messages'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [videos, setVideos] = useState([])
  const [friends, setFriends] = useState([])

  const currentUser = useMemo(() => users.find(u => u.id === currentUserId), [users, currentUserId])

  async function refreshUsers() {
    const res = await fetch(`${baseUrl}/users`)
    const data = await res.json()
    setUsers(data)
  }

  async function refreshVideos() {
    const res = await fetch(`${baseUrl}/videos`)
    const data = await res.json()
    setVideos(data)
  }

  async function refreshFriends() {
    if (!currentUserId) return
    const res = await fetch(`${baseUrl}/friends/${currentUserId}`)
    const data = await res.json()
    setFriends(data.map(d=>({ ...d, id: d.id || d._id })))
  }

  useEffect(() => { refreshUsers(); refreshVideos() }, [])
  useEffect(() => { refreshFriends() }, [currentUserId])

  const addSampleVideo = async () => {
    if (!currentUserId) return alert('Pick a user first')
    const payload = {
      title: `Sample Video ${Math.random().toString(36).slice(2,6)}`,
      url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      description: 'Sample video',
      uploader_id: currentUserId,
      thumbnail_url: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?q=80&w=1200&auto=format&fit=crop'
    }
    const res = await fetch(`${baseUrl}/videos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) refreshVideos(); else alert('Failed to add video')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header baseUrl={baseUrl} users={users} currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} refreshUsers={refreshUsers} />

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Video Feed</h2>
            <button onClick={addSampleVideo} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Add Sample Video</button>
          </div>
          <VideoFeed videos={videos} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Friends</h2>
            <Friends baseUrl={baseUrl} currentUserId={currentUserId} users={users} friends={friends} refreshFriends={refreshFriends} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <Messages baseUrl={baseUrl} currentUserId={currentUserId} friends={friends} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
