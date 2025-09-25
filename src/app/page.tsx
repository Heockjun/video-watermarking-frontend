import { PublicVideoGrid } from '@/components/PublicVideoGrid'

export default function HomePage() {
  return (
    <main className="bg-slate-50 text-gray-800">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            최신 업로드
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            DDW로 보호되고 있는 영상들을 확인해보세요.
          </p>
        </div>

        <PublicVideoGrid />
      </div>
    </main>
  )
}
