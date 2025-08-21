import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import AuthButton from '@/modules/auth/ui/components/auth-button';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import SearchInput from './search-input';

const HomeNavbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50'>
      <div className='flex items-center gap-4 w-full'>
        {/*Menu and Logo*/}
        <div className='flex items-center flex-shrink-0'>
          <SidebarTrigger />
          <Link
            prefetch
            href='/'
            className='hidden p-4 md:flex items-center gap-1'
          >
            <Image src='/logo.svg' alt='logo' width={32} height={32} />
            <p className='text-xl font-semibold tracking-tight'>NewTube</p>
          </Link>
        </div>

        {/*Search bar*/}
        <div className='flex-1 flex justify-center max-w-[720px] mx-auto'>
          <Suspense fallback={<Skeleton className='h-10 w-full' />}>
            <SearchInput />
          </Suspense>
        </div>

        <div className='flex-shrink-0 flex items-center gap-4'>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
