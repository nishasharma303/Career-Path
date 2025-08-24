import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
        <h2 className='font-bol text-3xl text-center'>Choose your plan</h2>
        <p className='text-lg text-center mt-3 mb-5'>Select a subscription bundle to get all AI Tools Access</p>
        <PricingTable />
    </div>
  )
}

export default page