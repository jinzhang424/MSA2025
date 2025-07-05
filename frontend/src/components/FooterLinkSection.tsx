import type { ReactNode } from "react"

interface FooterLinkSectionProps {
    title: string,
    children: ReactNode
}

function FooterLinkSection({title, children} : FooterLinkSectionProps) {
    return (
        <div>
            <h1 className="text-white text-2xl font-bold">{title}</h1>
            <div className="flex flex-col text-slate-300 mt-4 space-y-3">
                {children}
            </div>
        </div>
    )
}

export default FooterLinkSection
