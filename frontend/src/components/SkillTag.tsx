interface SkillTagProps {
    skill: string
}

const SkillTag = ({skill} : SkillTagProps) => {
    return (
        <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-950 rounded text-xs font-semibold">
            {skill}
        </span>
    )
}

export default SkillTag
