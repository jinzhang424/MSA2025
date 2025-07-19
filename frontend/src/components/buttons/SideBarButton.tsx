import type { ReactNode } from "react"

interface SideBarButtonProps {
    onClick: (...args: any[]) => any,
    children: ReactNode,
    className: string
}

/**
 * 
 * @param onClick - The onClick handler for the button
 * @param children - The child components of the side bar button
 * @param className - The className of the side bar button
 * @returns - A style side bar button
 */
const SideBarButton = ({ onClick, children, className } : SideBarButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex gap-x-3 items-center lg:px-4 lg:justify-normal justify-center px-2 py-2 rounded-lg ${className}`}
        >
            {children}
        </button>
    )
}

export default SideBarButton
