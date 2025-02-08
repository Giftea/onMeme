"use client"
import { useAddress } from '@/hooks'
import React from 'react'

export default function Text({ initialAddress }) {
    const { data: userId } = useAddress(initialAddress)

    console.log(userId)
  return (
    <div>Text</div>
  )
}
