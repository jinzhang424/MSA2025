import { type MouseEventHandler, type ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    bgFade?: boolean
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}

/**
 * 
 * @param bgFade determines if the background should fade or not (false by default)
 * @param children children components
 * @param className class name of the component 
 * @param onClick onClick handler
 * @returns A button that if bgFade is true, background will fade from 0 to full opacity
 */
function BGFadeButton({bgFade = false, children, className, onClick}: ButtonProps) {
    let buttonStyle = "rounded-md outline outline-gray-100 outline-2 hover:cursor-pointer font-semibold"
    if (bgFade) {
        buttonStyle += " text-gray-100 hover:text-navy bg-gray-100/0 hover:bg-gray-100/100 duration-300 ease-in-out"
    } else {
        buttonStyle += " text-navy bg-gray-100 hover:bg-gray-300 duration-300 ease-in-out hover:outline-gray-300"
    }

    buttonStyle += ` ${className}`

    return (
        <button className={buttonStyle} onClick={onClick}>
            {children}
        </button>
    )
}

export default BGFadeButton
