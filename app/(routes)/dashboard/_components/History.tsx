"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { aiToolsList } from './AiTools';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"

const History = () => {
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetHistory();
    }, [])

    const GetHistory = async () => {
        setLoading(true);
        const result = await axios.get('/api/history');
        console.log(result.data)
        setUserHistory(result.data);
        setLoading(false)
    }

    const GetAgentName = (path: string) => {
        const agent = aiToolsList.find(item => item.path == path);
        return agent
    }

    // Add this date formatting function
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateString; // fallback to original string if parsing fails
        }
    };

    return (
        <div className='mt-5 p-5 border rounded-sm'>
            <h2 className='font-bold text-lg'>Previous History</h2>
            <p className='font-semibold  text-gray-600'>What Your previously work on, You can find here</p>

            {loading &&
                <div>
                    {[1, 2, 3, 4, 5].map((item, index) => {
                        return (
                            <div key={index}>
                                <Skeleton className="h-[50px] w-full mt-5 rounded-md" />
                            </div>
                        );
                    })}
                </div>
            }

            {userHistory?.length == 0 && !loading ?
                <div className='flex items-center justify-center mt-6 flex-col '>
                    <Image src={'/idea.png'} alt='idea'
                        width={50} height={50} />
                    <h2 className='mt-3'>You don't have a history</h2>
                    <Button className='mt-3'>Explore AI Tools</Button>
                </div>
                :
                <div>
                    {userHistory?.map((history: any, index: number) => (
                        <Link 
                            href={history?.aiAgentType + "/" + history?.recordId} 
                            className='flex justify-between items-center my-3 border p-3 rounded-lg' 
                            key={index} // Move key here to fix React warning
                        >
                            <div className='flex gap-5'>
                                <Image 
                                    src={GetAgentName(history?.aiAgentType)?.icon} 
                                    alt={'image'}
                                    width={20}
                                    height={20}
                                />
                                <h2>{GetAgentName(history?.aiAgentType)?.name}</h2>
                            </div>
                            {/* Use the formatDate function here */}
                            <h2>{formatDate(history.createdAt)}</h2>
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default History