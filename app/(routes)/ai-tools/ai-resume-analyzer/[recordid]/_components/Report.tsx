import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import React, { useState } from 'react';

const getStatusColor = (per: number) => {
    if (per < 60) return 'red';
    if (per >= 60 && per <= 80) return 'yellow';
    return 'green';
};

const Report = ({ aiReport }: any) => {
    const [openResumeUpload, setOpenResumeDialog] = useState(false);

    // Function to get color based on score
    const getScoreColor = (score: number) => {
        if (score < 60) return 'red';
        if (score >= 60 && score <= 80) return 'yellow';
        return 'green';
    };

    // Get color for each section
    const getSectionColor = (sectionKey: string) => {
        if (!aiReport?.sections || !aiReport.sections[sectionKey]) return 'gray';
        return getScoreColor(aiReport.sections[sectionKey].score);
    };

    // Color mapping for text and backgrounds
    const colorMap: any = {
        red: {
            text: 'text-red-600',
            bg: 'bg-red-100',
            border: 'border-red-200',
            gradient: 'from-red-500 to-red-700',
            light: 'bg-red-50'
        },
        yellow: {
            text: 'text-yellow-600',
            bg: 'bg-yellow-100',
            border: 'border-yellow-200',
            gradient: 'from-yellow-500 to-yellow-700',
            light: 'bg-yellow-50'
        },
        green: {
            text: 'text-green-600',
            bg: 'bg-green-100',
            border: 'border-green-200',
            gradient: 'from-green-500 to-green-700',
            light: 'bg-green-50'
        },
        gray: {
            text: 'text-gray-600',
            bg: 'bg-gray-100',
            border: 'border-gray-200',
            gradient: 'from-gray-500 to-gray-700',
            light: 'bg-gray-50'
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">AI Analysis Results</h2>
                    <button 
                        type="button" 
                        onClick={() => setOpenResumeDialog(true)}
                        className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                    >
                        Re-analyze <i className="fa-solid fa-sync ml-2"></i>
                    </button>
                </div>

                {/* Overall Score */}
                <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-lg shadow-md p-6 mb-6 text-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <i className="fas fa-star text-yellow-400 mr-2"></i> Overall Score
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-6xl font-extrabold">{aiReport?.overall_score}<span className="text-2xl">/100</span></span>
                        <div className="flex items-center">
                            <i className="fas fa-arrow-up text-green-300 text-lg mr-2"></i>
                            <span className="text-green-300 text-lg font-bold">{aiReport?.overall_feedback}</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
                            style={{ width: `${aiReport?.overall_score}%` }}
                        ></div>
                    </div>
                    <p className="text-blue-100 text-sm">{aiReport?.summary_comment}</p>
                </div>

                {/* Section Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {aiReport?.sections &&
                        Object.entries(aiReport.sections).map(([key, value]: any) => {
                            const color = getSectionColor(key);
                            const colorClass = colorMap[color];
                            
                            return (
                                <div key={key} className={`rounded-lg shadow-md p-5 ${colorClass.border} border-2 ${colorClass.light} relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                        <i className={`fas fa-user-circle ${colorClass.text} mr-2`}></i> 
                                        {key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </h4>
                                    <span className={`text-4xl font-bold ${colorClass.text}`}>{value.score}%</span>
                                    <p className="text-sm text-gray-600 mt-2">{value.comment}</p>
                                    <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${colorClass.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                </div>
                            );
                        })}
                </div>

                {/* Tips for Improvement */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                        <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
                    </h3>
                    <ul className="list-none space-y-4">
                        {aiReport?.tips_for_improvement?.map((tip: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                    <i className="fas fa-check text-xs"></i>
                                </span>
                                <p className="text-gray-600 text-sm">{tip}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What's Good / Needs Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-lg shadow-md p-5 border border-green-200">
                        <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                            <i className="fas fa-thumbs-up text-green-500 mr-2"></i> What's Good
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                            {aiReport?.whats_good?.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50 rounded-lg shadow-md p-5 border border-red-200">
                        <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                            <i className="fas fa-thumbs-down text-red-500 mr-2"></i> Needs Improvement
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                            {aiReport?.needs_improvement?.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={() => setOpenResumeDialog(false)} />
        </div>
    );
};

export default Report;