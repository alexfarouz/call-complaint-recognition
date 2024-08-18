import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SignedIn, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // This ensures that the code only runs on the client side
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  return (
    <nav className="p-1 bg-transparent relative">
      <div className="container flex items-center">
        <a href="/" className="flex items-center text-white text-xl font-bold">
          <Image src="/assets/Saphire.png" alt="Logo" width={80} height={80} className="mr-1" />
          <span className="text-[#96addf] hidden md:block">Saphire</span>
        </a>
        <div className="absolute lg:top-5 lg:right-5 top-6 right-1 flex space-x-4">
            {pathname !== '/recognition' && (
                <a href="/recognition" className="bg-transparent text-white px-4 py-2 rounded lg:border border-white hover:text-[#96addf] lg:hover:border-[#96addf]">
                    Recognition
                </a>
            )}
            <SignedIn><UserButton></UserButton></SignedIn>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
