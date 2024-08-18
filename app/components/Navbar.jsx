import React from 'react';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="p-1 bg-transparent">
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center text-white text-xl font-bold">
          <Image src="/assets/Saphire.png" alt="Logo" width={80} height={80} className="mr-1" />
          <span className="text-[#96addf] hidden md:block">Saphire</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
