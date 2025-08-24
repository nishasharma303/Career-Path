import React from 'react'
import AiToolsCard from './AiToolsCard'

export const aiToolsList=[
    {
       name:'AI Career Q&A Chat',
       desc:'Chat with AI agent',
       icon:'/chatbot.png', 
       button:'Ask Now',
       path:'/ai-tools/ai-chat'
    },
    {
       name:'AI Resume analyzer',
       desc:'Improve your resume ',
       icon:'/resume.png', 
       button:'Analyze Now',
       path:'/ai-tools/ai-resume-analyzer'
    },
    {
       name:'Career Roadmap Generator',
       desc:'Build your roadmap',
       icon:'/roadmap.png', 
       button:'Generate Now',
       path:'/ai-tools/ai-roadmap-agent'
    }
]

function AiTools  () {
  return (
    <div className='mt-7 p-5 bg-white border rounded'>
        <h2 className='font-bold text-lg'>Available AI Tools</h2>
        <p className='text-gray-500 mt-3'>Start Building and Shape Your Career with this exclusive AI Tools</p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-5'>
            {aiToolsList.map((tool:any, index) => (
                <AiToolsCard tool={tool} key={index} />
                
            ))}
        </div>
    </div>
  )
}

export default AiTools