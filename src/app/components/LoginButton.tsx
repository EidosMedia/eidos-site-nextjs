'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './baseComponents/button';
import { CircleUserRound, LogOut } from 'lucide-react';
import useWebauth from '@/hooks/useWebauth';

const LoginButton: React.FC<{ webauth?: string }> = ({ webauth }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentWebauth, setCurrentWebauth] = useState(webauth);
  const { data: webauthData } = useWebauth();

  // Refresh the button if webauth changes
  useEffect(() => {
    setCurrentWebauth(webauth);
    setShowMenu(false);
  }, [webauth]);

  const handleLogout = async () => {
    // Call a dedicated logout API route to clear the cookie server-side
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
    setShowMenu(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-space-2xs relative">
      <div className="flex gap-space-2xs">
        <Button variant="default">Subscribe</Button>
        {currentWebauth ? (
          <>
            <div className="flex flex-col relative">
              <Button
                variant="secondary"
                className="flex items-center gap-space-2xs"
                onClick={() => setShowMenu(v => !v)}
              >
                {webauthData.userName} <CircleUserRound />
              </Button>
              {showMenu && (
                <div className="relative">
                  <div className="bg-canvas z-20 flex absolute mt-space-3xs left-0 flex-row items-center justify-start rounded-sm shadow-lg border-line border-1 ml-0 w-fit">
                    <div className="flex items-center gap-space-2xs p-space-2xs hover:bg-surface rounded-sm">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-space-3xs hover:bg-surface"
                        onClick={handleLogout}
                      >
                        Logout <LogOut />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="/login" className="flex items-center gap-space-2xs">
            <Button variant="secondary" className="flex items-center gap-space-2xs">
              Login <CircleUserRound />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LoginButton;
