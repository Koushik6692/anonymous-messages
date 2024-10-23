// components/LogoutButton.tsx

import { signOut } from 'next-auth/react';
import React from 'react';

const LogoutButton: React.FC = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/sign-in' })}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
