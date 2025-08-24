import { Button } from '@/components/ui/button'
import React from 'react'

const WelcomeBanner = () => {
  return (
    <div className='p-5 bg-gradient-to-r from-[#b501af] to-[#d70970] rounded-lg shadow-md mb-5'>
        <h2 className='font-bold text-2xl text-white'>Career Path</h2>
        <p className='text-white'>Smarter career decisions start here — get tailored advice, real-time market insights, and a roadmap built just for you with the power of AI.</p>
        <Button variant={'outline'} className='mt-3 ' >Lets Get Started</Button>
    </div>
  )
}

export default WelcomeBanner