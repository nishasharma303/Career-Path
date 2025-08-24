import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SparklesIcon } from 'lucide-react'
import axios from 'axios'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'

const RoadmapGeneratorDialog = ({openDialog, setOpenDialog}:any) => {

  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GenerateRoadmap = async () => {
    const roadmapId = v4();
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-roadmap-agent', {
        roadmapId: roadmapId,
        userInput: userInput
      });
      console.log(result.data)
      router.push('/ai-tools/ai-roadmap-agent/' + roadmapId);
      setLoading(false);
    } catch(e) {
      setLoading(false);
      console.log(e)
    }
  }

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Your Career Roadmap</DialogTitle>
            <DialogDescription asChild>
              <div className='mt-2'>
                <Input 
                  placeholder='e.g Full Stack Developer' 
                  onChange={(event) => setUserInput(event.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={GenerateRoadmap}
              disabled={loading || !userInput}
            >
              {loading ? <Loader2Icon className='animate-spin mr-2' /> : <SparklesIcon className='mr-2' />}
              Generate Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoadmapGeneratorDialog