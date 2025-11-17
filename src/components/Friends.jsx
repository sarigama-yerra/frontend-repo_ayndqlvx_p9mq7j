export default function Friends({ baseUrl, currentUserId, users, friends, refreshFriends }) {
  const sendRequest = async (toUserId) => {
    try {
      const res = await fetch(`${baseUrl}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_user_id: toUserId, from_user_id: currentUserId })
      })
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t)
      }
      await refreshFriends()
    } catch (e) {
      alert(e.message)
    }
  }

  const respond = async (friendId, action) => {
    try {
      const res = await fetch(`${baseUrl}/friends/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend_id: friendId, action, user_id: currentUserId })
      })
      if (!res.ok) throw new Error('Failed to respond')
      await refreshFriends()
    } catch (e) {
      alert(e.message)
    }
  }

  const otherUsers = users.filter(u => u.id !== currentUserId)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">People</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {otherUsers.map(u => (
            <div key={u.id} className="p-3 border rounded flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img src={u.avatar_url} className="h-8 w-8 rounded-full" />
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
              </div>
              <button onClick={() => sendRequest(u.id)} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Add</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Your Connections</h3>
        <div className="space-y-2">
          {friends.map(fr => (
            <div key={fr.id} className="p-3 border rounded bg-white flex items-center justify-between">
              <div>
                <div className="font-medium">{fr.other_user?.username || 'Unknown'}</div>
                <div className="text-xs text-gray-500">Status: {fr.status}</div>
              </div>
              {fr.status === 'pending' && fr.other_user && fr.other_user.id && (
                <div className="flex gap-2">
                  <button onClick={() => respond(fr.id, 'accept')} className="px-2 py-1 text-sm bg-green-600 text-white rounded">Accept</button>
                  <button onClick={() => respond(fr.id, 'reject')} className="px-2 py-1 text-sm bg-red-600 text-white rounded">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
