import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      {children}
    </div>
  );
};

export default Layout;
