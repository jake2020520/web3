import Hero from '@/components/hero'
import React from 'react'
import performanceSrc from '@/img/performance.jpg'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Performance',
}
export default function Page() {
  return (
    <Hero imgUrl={performanceSrc} altTxt="Performance" content="Performance~~~" />
  )
}
