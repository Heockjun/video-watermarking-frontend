'use client'

import { useEffect, useState } from 'react'
import { VideoCard } from './VideoCard'

interface Video {
  id: number
  title: string
  thumbnail_url: string | null // Add thumbnail_url
  original_filename: string
  playback_filename: string
  upload_timestamp: string
  user: {
    username: string
  }
}

export function PublicVideoGrid() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/videos/public')
        if (!response.ok) {
          throw new Error('비디오 목록을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setVideos(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) {
    return <p className="text-center">비디오 목록을 불러오는 중...</p>
  }

  if (videos.length === 0) {
    return (
      <p className="text-center text-gray-500">
        아직 업로드된 비디오가 없습니다.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} showUploader={true} />
      ))}
    </div>
  )
}
