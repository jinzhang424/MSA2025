interface HowItWorksCardProps {
  stepNum: number;
  title: string;
  bodyText: string;
}

function HowItWorksCard({stepNum, title, bodyText}: HowItWorksCardProps) {
  return (
    <div className='flex flex-col justify-center items-center p-8 text-gray-700 text-center min-w-[300px] max-w-[450px]'>
      <div className='flex flex-col justify-center items-center space-y-4'>
        <p className='text-black flex items-center justify-center rounded-full bg-orange-300/40 w-16 h-16 font-bold text-2xl'>
          {stepNum}
        </p>

        <h1 className='text-black font-bold text-2xl'>
          {title}
        </h1>
      </div>

      <p className='mt-6'>
        {bodyText}
      </p>
    </div>
  )
}

export default HowItWorksCard
