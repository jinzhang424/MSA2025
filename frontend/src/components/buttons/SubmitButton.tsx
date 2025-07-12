import { type ReactNode } from 'react'
import Spinner from '../animation/Spinner'

interface SubmitButtonProps {
    className?: string,
    isLoading?: boolean,
    children?: ReactNode,
}

function SubmitButton({isLoading = false, children, className,} : SubmitButtonProps) {
  return (
    <button
        type="submit"
        className={`relative flex justify-center items-center bg-purple-950 text-white rounded-md font-semibold hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-950 focus:ring-offset-2 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-fit ${className}`}
        disabled={isLoading}
    >
        <div className='absolute mx-auto'><Spinner isLoading={isLoading}/></div>
        <div className={`flex justify-center items-center ${isLoading && "opacity-0"}`}>
            {children}
        </div>
    </button>
  )
}

export default SubmitButton
