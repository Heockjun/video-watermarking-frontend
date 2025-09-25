'use client'

import {
  ShieldIcon,
  TargetIcon,
  DiamondIcon,
  WandIcon,
} from '@/components/icons'
import Link from 'next/link'

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg ring-1 ring-slate-200/50">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{children}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <section className="h-full w-full snap-start flex flex-col justify-center items-center text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            콘텐츠를 지키는 가장 확실한 방법
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600">
            DDW(Dynamic Digital Watermarking)는 육안으로 식별할 수 없는 고유
            서명을 영상에 삽입하여, 불법 유출 시 유포자를 정확하게 추적하고
            콘텐츠의 가치를 지킵니다.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="h-full w-full snap-start flex flex-col justify-center items-center"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              DDW만의 핵심 기술
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              단순한 워터마크를 넘어, 콘텐츠 보안을 위한 완벽한 솔루션을
              제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<ShieldIcon />} title="강력한 암호화 보안">
              모든 워터마크 정보는 서버의 비밀 키로 암호화됩니다. 데이터가
              유출되어도 저희 서버가 아니면 절대 해독할 수 없습니다.
            </FeatureCard>
            <FeatureCard icon={<TargetIcon />} title="정확한 유출자 추적">
              영상마다 고유한 사용자 정보가 삽입되어, 유출 발생 시 어떤 사용자의
              영상인지 100% 정확하게 식별할 수 있습니다.
            </FeatureCard>
            <FeatureCard icon={<DiamondIcon />} title="원본 화질 보존">
              무손실 압축 코덱(Lossless Codec)을 사용하여 워터마크를 삽입하므로,
              원본 영상의 화질 저하가 전혀 없습니다.
            </FeatureCard>
            <FeatureCard icon={<WandIcon />} title="간편한 사용법">
              복잡한 과정 없이 영상을 업로드하기만 하면, 모든 워터마킹 과정이
              자동으로 처리되는 직관적인 시스템을 제공합니다.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="h-full w-full snap-start flex flex-col justify-center items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              어떻게 작동하나요?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              단 3단계로 당신의 콘텐츠를 안전하게 보호하세요.
            </p>
          </div>
          <div className="relative">
            <div
              className="absolute left-1/2 top-8 bottom-8 w-px bg-slate-200 hidden lg:block"
              aria-hidden="true"
            ></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white ring-1 ring-slate-200/50 shadow-lg rounded-full text-2xl font-bold text-blue-600">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  영상 업로드
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  보호하고 싶은 원본 영상을 업로드합니다. 회원가입 후 누구나
                  쉽게 이용할 수 있습니다.
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white ring-1 ring-slate-200/50 shadow-lg rounded-full text-2xl font-bold text-blue-600">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  자동 워터마킹
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  시스템이 자동으로 당신의 고유 정보를 암호화하여 비가시성
                  워터마크로 영상에 삽입합니다.
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white ring-1 ring-slate-200/50 shadow-lg rounded-full text-2xl font-bold text-blue-600">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  워터마크 검증
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  업로드 후 '워터마크 정보 확인'을 통해 내 정보가 안전하게
                  삽입되었는지 직접 검증할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-full w-full snap-start flex flex-col justify-center items-center text-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            지금 바로 당신의 콘텐츠를 보호하세요
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            더 이상 콘텐츠 불법 유출로 고민하지 마세요. DDW가 가장 확실한
            해결책을 제공합니다.
          </p>
          <div className="mt-8">
            <Link
              href="/watermark/insert"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 transform"
            >
              영상 업로드 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
