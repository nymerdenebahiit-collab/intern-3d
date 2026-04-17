'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { PanelLeftIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type SidebarContextValue = {
  isMobile: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  children,
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [open, setOpen] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const updateState = (event?: MediaQueryListEvent) => {
      const nextIsMobile = event?.matches ?? mediaQuery.matches
      setIsMobile(nextIsMobile)
      setOpen(!nextIsMobile)
    }

    updateState()
    mediaQuery.addEventListener('change', updateState)

    return () => mediaQuery.removeEventListener('change', updateState)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setOpen((current) => !current)
  }, [])

  return (
    <SidebarContext.Provider value={{ isMobile, open, setOpen, toggleSidebar }}>
      <div
        className={cn(
          'flex min-h-screen w-full bg-background text-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<'aside'>) {
  const { isMobile, open, setOpen } = useSidebar()

  if (isMobile) {
    return (
      <>
        {open && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform md:hidden',
            open ? 'translate-x-0' : '-translate-x-full',
            className,
          )}
          {...props}
        >
          <div className="flex h-full flex-col">{children}</div>
        </aside>
      </>
    )
  }

  return (
    <aside
      className={cn(
        'hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex',
        open ? 'w-64' : 'w-0 overflow-hidden border-r-0',
        className,
      )}
      {...props}
    >
      <div className={cn('flex h-full w-64 shrink-0 flex-col', !open && 'hidden')}>
        {children}
      </div>
    </aside>
  )
}

function SidebarInset({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex min-h-screen min-w-0 flex-1 flex-col', className)}
      {...props}
    />
  )
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9', className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-4 p-4', className)} {...props} />
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 border-t border-sidebar-border p-4', className)}
      {...props}
    />
  )
}

function SidebarContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto', className)}
      {...props}
    />
  )
}

function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 px-2', className)} {...props} />
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn(className)} {...props} />
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-2', className)} {...props} />
}

function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return <ul className={cn('space-y-1', className)} {...props} />
}

function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return <li className={cn(className)} {...props} />
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-primary/10 text-sidebar-primary'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        className,
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
