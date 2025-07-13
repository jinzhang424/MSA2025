import type { ReactNode } from 'react'
import Spinner from '../animation/Spinner'

interface SpinnerLoaderProps {
  children?: ReactNode
  className?: string
}

const SpinnerLoader = ({children, className} : SpinnerLoaderProps) => {
  return (
    <div className={`flex text-gray-500 items-center gap-x-4 ${className}`}>
        <Spinner isLoading={true} className='text-gray-500'/> 
        { children }
    </div>
  )
}

export default SpinnerLoader

