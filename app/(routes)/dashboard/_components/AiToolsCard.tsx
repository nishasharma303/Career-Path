"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ResumeUploadDialog from './ResumeUploadDialog';
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog';


interface TOOL{
    name: string;
    desc: string;
    icon: string;
    button: string;
    path: string;
}

type AIToolProps={
    tool: TOOL
}

const AiToolsCard = ({ tool}: AIToolProps) => {
  const id=uuidv4();
  const {user} = useUser();
  const router = useRouter();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);

  const onClickButton =async ()=>{

    if(tool.name == 'AI Resume analyzer'){
      setOpenResumeUpload(true);
      return;
    }

    if(tool.path == '/ai-tools/ai-roadmap-agent'){
      setOpenRoadmapDialog(true);
      return;
    }
    

    //create new record to history table
    const result = await axios.post('/api/history', {
      recordId:id,
      content:[], 
      aiAgentType:tool.path
    });
    console.log(result);
    router.push(tool.path+"/"+id);
  }

  return (
    <div className='p-3 border rounded-lg '>
        <Image src={tool.icon} width={60} height={60} alt={tool.name} />
        <h2 className='font-bold mt-2'>{tool.name}</h2>
        <p className='text-gray-400'>{tool.desc}</p>
        
        <button className='bg-black text-white w-full mt-3 px-3 py-1 text-sm border rounded-md hover:bg-gray-800'
        onClick={onClickButton}
        >{tool.button}</button>
        

        <ResumeUploadDialog openResumeUpload={openResumeUpload} 
        setOpenResumeDialog={setOpenResumeUpload} />
        <RoadmapGeneratorDialog openDialog={openRoadmapDialog} 
        setOpenDialog={()=> setOpenRoadmapDialog(false)} />
    </div>
  )
}

export default AiToolsCard