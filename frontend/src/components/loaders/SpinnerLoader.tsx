import type { ReactNode } from 'react'
import Spinner from '../animation/Spinner'

interface SpinnerLoaderProps {
  children: ReactNode
}

const SpinnerLoader = ({children} : SpinnerLoaderProps) => {
  return (
    <div className='flex text-gray-500 items-center gap-x-4'>
        <Spinner isLoading={true} className='text-gray-500'/> 
        { children }
    </div>
  )
}

export default SpinnerLoader

