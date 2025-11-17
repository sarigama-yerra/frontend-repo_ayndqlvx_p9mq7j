import { useEffect } from 'react'

export default function Header({ baseUrl, users, currentUserId, setCurrentUserId, refreshUsers }) {
  const createUser = async () => {
    const username = `user_${Math.random().toString(36).slice(2,7)}`
    const email = `${username}@example.com`
    try {
      const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, avatar_url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}` })
      })
      if (!res.ok) throw new Error('Failed to create user')
      await refreshUsers()
    } catch (e) {
      alert(e.message)
    }
  }

  useEffect(() => {
    if (!currentUserId && users.length > 0) setCurrentUserId(users[0].id || users[0]._id)
  }, [users])

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white/70 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded bg-blue-600 text-white grid place-items-center font-bold">V</div>
        <div>
          <h1 className="text-xl font-semibold">VibeTube</h1>
          <p className="text-xs text-gray-500">Videos • Friends • Messages</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={currentUserId || ''}
          onChange={(e) => setCurrentUserId(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <button onClick={createUser} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">New User</button>
      </div>
    </div>
  )
}
