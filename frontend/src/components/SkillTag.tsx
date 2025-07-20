interface SkillTagProps {
    label: string
}

const SkillTag = ({label} : SkillTagProps) => {
    return (
        <span key={label} className="px-2 py-1 bg-purple-100 text-purple-950 rounded text-xs">
            {label}
        </span>
    )
}

export default SkillTag
