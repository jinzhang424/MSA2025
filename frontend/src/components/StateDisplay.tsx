import type { ReactNode } from "react"
import { BsEmojiDizzy } from "react-icons/bs";
import { PiEmptyLight } from "react-icons/pi";
import Spinner from "./animation/Spinner";

interface StateDisplayProps {
    children: ReactNode
    loadingMsg?: string
    isLoading?: boolean
    isError?: boolean
    errorMsg?: string
    isEmpty?: boolean,
    emptyMsg?: string
}

/**
 * 
 * @param children children of the component
 * @param isLoading a boolean determining if something is loading
 * @param loadingMsg the message displayed while component loads
 * @param isError a boolean determining if an error has occurred
 * @param errorMsg the message displayed when an error occurs
 * @param isEmpty a boolean determining if the component is empty
 * @param emptyMsg the message displayed when component is empty
 * @returns a loading state, error state, empty state or normal state of a component
 */
const StateDisplay = ({ 
    children, 
    isLoading = false, 
    loadingMsg, 
    isError = false, 
    errorMsg, 
    isEmpty = false,
    emptyMsg
} : StateDisplayProps) => {

    if (isLoading) {
        return (
            <div className="flex justify-center gap-x-3 items-center text-gray-500 mx-auto my-auto">
                <Spinner isLoading={true} />
                <p>{!!loadingMsg ? loadingMsg : 'Loading...'}</p>
            </div>
        )
    } else if (isError) {
        return (
            <div className="flex flex-col justify-center items-center mx-auto my-auto text-gray-500 gap-y-1 text-center">
                <BsEmojiDizzy className="w-10 h-10"/>
                <p>{errorMsg ? errorMsg : 'Oops! An unexpected has error occurred.'}</p>
            </div>
        )
    } else if (isEmpty) { 
        return (
            <div className="flex flex-col justify-center items-center gap-1 mx-auto my-auto text-center text-gray-500">
                <PiEmptyLight className="w-10 h-10"/>
                <p>{emptyMsg ? emptyMsg : 'Nothing was found'}</p>
            </div>
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default StateDisplay
