'use client'

import { useState } from 'react'
import { Input, Button } from 'antd'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log({ name, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e13] px-4">
      <div className="w-full max-w-md bg-[#1a1f2b] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">Sign Up</h1>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            className="dark-input"
          />
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="dark-input"
          />
          <Input.Password
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="dark-input"
          />
        </div>

        <Button
          type="primary"
          block
          className="mt-6 book-button"
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-purple-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
