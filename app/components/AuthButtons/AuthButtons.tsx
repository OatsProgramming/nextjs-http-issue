'use client'

import { signIn } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export function SignIn() {
    return (
        <button onPointerDown={() => signIn()}>
            Sign in
        </button>
    )
}

export function SignOut() {
    return (
        <button onPointerDown={() => signOut()}>
            Sign out
        </button>
    )
}
