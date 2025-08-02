import AntdClientProvider from '@/app/antdClientProvider'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/themeContext'
import '@/common/styles/frame.scss'
// import FakeError from '@/components/fakeError'

export const metadata: Metadata = {
    title: 'My Next.js 15 App',
    description: 'Next.js 15教学项目',
    keywords: 'Next.js,React,前端开发',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                {/* <div>环境变量test_env={process.env.TEST_ENV}</div>
                <FakeError /> */}
                    <AntdClientProvider>{children}</AntdClientProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
