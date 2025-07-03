interface HowItWorksCardProps {
  stepNum: number;
  title: string;
  bodyText: string;
}

function HowItWorksCard({stepNum, title, bodyText}: HowItWorksCardProps) {
  return (
    <div className='grid grid-rows-2 justify-center items-center p-8 text-gray-700'>
      <header className='flex flex-col justify-center items-center space-y-4'>
        <p className='text-black flex items-center justify-center rounded-full bg-orange-300/40 w-16 h-16 font-bold text-2xl'>
          {stepNum}
        </p>

        <h1 className='text-black font-bold text-2xl'>
          {title}
        </h1>
      </header>

      <p className='text-center'>
        {bodyText}
      </p>
    </div>
  )
}

export default HowItWorksCard
