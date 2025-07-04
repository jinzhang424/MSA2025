import React from 'react'

interface WhoIsItForCardProps {
    icon: React.ReactNode,
    title: string,
    bodyText: string
}

function WhoIsItForCard({icon, title, bodyText} : WhoIsItForCardProps) {
    return (
        <div className='flex flex-col justify-center items-center text-center shadow-[6px_6px_16px_#bebebe,_-8px_-8px_16px_#ffffff] rounded-lg p-8 space-y-3'>
            <div className='bg-purple-700/20 w-16 h-16 p-4 rounded-full'>
                {icon}
            </div>
            <h1 className='font-bold text-2xl'>{title}</h1>
            <p className='text-gray-700'>{bodyText}</p>
        </div>
    )
}

export default WhoIsItForCard
