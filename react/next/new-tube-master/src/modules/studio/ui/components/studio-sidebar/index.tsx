'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LogOutIcon, VideoIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import StudioSidebarHeader from '@/modules/studio/ui/components/studio-sidebar/studio-sidebar-header';

const StudioSidebar = () => {
  const pathname = usePathname();
  return (
    <Sidebar className='pt-16 z-40 ' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <StudioSidebarHeader />

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Content'
                  isActive={pathname === '/studio'}
                  asChild
                >
                  <Link prefetch href='/studio'>
                    <VideoIcon className='size-5' />
                    <span className='text-sm'>Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator className='my-2' />
              <SidebarMenuItem>
                <SidebarMenuButton tooltip='Exit studio' asChild>
                  <Link prefetch href='/'>
                    <LogOutIcon className='size-5' />
                    <span className='text-sm'>Exit Studio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;
