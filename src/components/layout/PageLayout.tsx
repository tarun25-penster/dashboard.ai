import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function PageLayout({ title, children }) {
  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className='mt-16 p-6'>
        <h1 className='mb-4 text-2xl font-bold'>{title}</h1>
        <div className='rounded-lg bg-white p-4 shadow-md'>{children}</div>
      </div>
    </>
  )
}
