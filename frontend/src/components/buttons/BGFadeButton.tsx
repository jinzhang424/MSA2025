import React, { type ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    bgFade?: boolean
    className?: string
}

function BGFadeButton({bgFade = false, children, className}: ButtonProps) {
    let buttonStyle = "rounded-md outline outline-white outline-2 hover:cursor-pointer font-semibold"
    if (bgFade) {
        buttonStyle += " text-white hover:text-purple-950 bg-white/0 hover:bg-white/100 duration-300 ease-in-out"
    } else {
        buttonStyle += " text-purple-950 bg-white"
    }

    buttonStyle += ` ${className}`

    return (
        <div>
            <button className={buttonStyle}>
                {children}
            </button>
        </div>
    )
}

export default BGFadeButton
