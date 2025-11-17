export default function VideoFeed({ videos }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map(v => (
        <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="group border rounded-lg overflow-hidden bg-white hover:shadow">
          {v.thumbnail_url ? (
            <img src={v.thumbnail_url} alt={v.title} className="aspect-video w-full object-cover" />
          ) : (
            <div className="aspect-video w-full bg-gray-200 grid place-items-center text-gray-500">No Thumbnail</div>
          )}
          <div className="p-3">
            <div className="font-semibold line-clamp-2 group-hover:text-blue-600">{v.title}</div>
            <div className="text-xs text-gray-500 mt-1">by {v.uploader?.username || v.uploader_id}</div>
          </div>
        </a>
      ))}
    </div>
  )
}
