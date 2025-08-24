import React from 'react'
import AiTools from '../dashboard/_components/AiTools'

const AiToolsList = () => {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Career AI Assistants
        </h1>
        <p className="text-lg font-semibold text-gray-600 max-w-2xl mx-auto">
          Your personal AI team for career growth - get expert guidance, roadmap planning, and resume optimization
        </p>
      </div>
      <AiTools />
    </div>
  )
}

export default AiToolsList