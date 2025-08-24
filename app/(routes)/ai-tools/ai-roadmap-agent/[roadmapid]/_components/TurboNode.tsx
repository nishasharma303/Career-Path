import React from 'react'
import { Handle, Position } from 'reactflow'
import Link from 'next/link'

const TurboNode = ({ data }: any) => {
  return (
    <div className='rounded-lg border border-gray-300 bg-yellow-100 shadow-md w-64 p-4 relative '>
      <div className='font-bold text-lg text-gray-800'>{data.title}</div>
      <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{data.description}</p>
      
      <Handle type='target' position={Position.Top} className='w-3 h-3 bg-gray-400' />
      <Handle type='source' position={Position.Bottom} className='w-3 h-3 bg-gray-400' />
    </div>
  )
}

export default TurboNode