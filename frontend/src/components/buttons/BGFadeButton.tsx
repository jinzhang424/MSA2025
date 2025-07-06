import { type MouseEventHandler, type ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    bgFade?: boolean
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}

function BGFadeButton({bgFade = false, children, className, onClick}: ButtonProps) {
    let buttonStyle = "rounded-md outline outline-white outline-2 hover:cursor-pointer font-semibold"
    if (bgFade) {
        buttonStyle += " text-white hover:text-navy bg-white/0 hover:bg-white/100 duration-300 ease-in-out"
    } else {
        buttonStyle += " text-navy bg-white"
    }

    buttonStyle += ` ${className}`

    return (
        <button className={buttonStyle} onClick={onClick}>
            {children}
        </button>
    )
}

export default BGFadeButton
