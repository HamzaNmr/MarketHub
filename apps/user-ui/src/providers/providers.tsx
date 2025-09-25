import { ThemeProvider } from '@market-hub/packages/ui/shadcn/src/components/providers/theme-provider'
import { ReactNode } from 'react'
import TanstackProvider from './tanstack-provider'


export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    </TanstackProvider>
  )
}
