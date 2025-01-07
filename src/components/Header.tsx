import Link from 'next/link';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';

const Header = () => {
  return (
    <nav className='flex justify-between items-center py-4 px-5 mb-4 navbar bg-base-100'>
      <Link href='/'>
        <h3 className='btn btn-ghost text-xl'>CrowdCoin</h3>
      </Link>
      <div className='flex items-center gap-5 mr-5'>
        <Link href='/'>
          <p className='btn btn-ghost'>Campaigns</p>
        </Link>
        <Link href='/new-campaign' className='btn btn-square btn-ghost'>
          <FaPlus />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
