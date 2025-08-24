"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import Report from './_components/Report';

const AiResumeAnalyzer = () => {
  const { recordid } = useParams();
  const [pdfUrl, setPdfUrl] = useState();
  const [aiReport, setAiReport] = useState();

  useEffect(() => {
    recordid && GetResumeAnalyzerRecord();
  },[recordid])

  const GetResumeAnalyzerRecord=async()=>{
    const result = await axios.get('/api/history?recordId='+ recordid);
    console.log(result.data);
    setPdfUrl(result.data?.metaData);
    setAiReport(result.data?.content);
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Report Section - Exactly 50% width */}
      <div className='lg:w-1/2 w-full p-4 overflow-y-auto'>
        <Report aiReport={aiReport} />
      </div>
      
      {/* Resume Preview Section - Exactly 50% width */}
      <div className='lg:w-1/2 w-full p-4'>
        <div className="bg-white rounded-lg shadow-md p-3 mb-3">
          <h2 className='font-bold text-xl text-gray-800'>Resume Preview</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md h-[80vh]">
          <iframe 
            src={pdfUrl+'#toolbar=0&navpanes=0&scrollbar=0'}
            className="w-full h-full"
            style={{border: 'none'}}
          />
        </div>
      </div>
    </div>
  )
}

export default AiResumeAnalyzer