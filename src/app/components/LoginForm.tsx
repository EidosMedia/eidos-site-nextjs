'use client';
import React, { useState } from 'react';
import useWebauth from '@/hooks/useWebauth';
import { CircleX } from 'lucide-react';
import { Button } from './baseComponents/button';

const LoginForm: React.FC = () => {
  const { data: webauthData, setUserName } = useWebauth();
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(false);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('email') as string;
    const password = formData.get('password') as string;
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    if (res.ok) {
      setLoginError(false);
      const webauthResp = await res.json();
      setUserName(webauthResp.name);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <form className="bg-canvas p-space-lg rounded-sm shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-h3 mb-space-md text-center">Log in</h2>
        {loginError && (
          <div className="bg-feedback-red text-inverse text-center py-space-2xs rounded-sm flex items-center justify-center gap-space-2xs mb-space-sm">
            <CircleX /> <span>Unable to login</span>
          </div>
        )}
        <p className="mb-space-sm text-copy-muted">
          Enter your credential to access all The Globe products. By proceeding, you agree to out terms and conditions.
        </p>
        <p className="mb-space-sm text-copy-muted">For information about how we use your data, see our privacy policy.</p>
        <div className="mb-space-sm">
          <label className="block text-copy mb-space-2xs" htmlFor="email">
            Username
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className="w-full px-space-xs py-space-2xs border rounded-sm focus:outline-none focus:ring focus:border-primary-light"
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-space-md">
          <label className="block text-copy mb-space-2xs" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-space-xs py-space-2xs border rounded-sm focus:outline-none focus:ring focus:border-primary-light"
            required
            autoComplete="current-password"
          />
        </div>
        <Button variant="default" className="flex items-center gap-space-2xs">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
