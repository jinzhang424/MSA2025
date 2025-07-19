import { useState } from "react"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface TextInputProps {
    htmlFor?: string,
    label?: string,
    type: string,
    id?: string,
    name?: string,
    required?: boolean,
    className? :string,
    placeholder?: string,
    value?: string,
    onChange?: (...args: any[]) => any
}

/**
 * @return A stylized text component with a label on the top right of it. Also allows toggling text obscuration (text as dots) if the type is password
 * 
 * @param htmlFor - the htmlFor for the label
 * @param label - the display text of the label
 * @param type - the input type
 * @param id - the input id
 * @param name - the input name
 * @param required - a boolean representing if the input is required
 * @param className - the input's className
 * @param placeholder - the placeholder text of the input
 * @param onChange - the onChange handler of the input
 * @param value - the value of the input
 */
const TextInput = ({ 
    /** The htmlFor for the label */
    htmlFor,
    label, 
    type, 
    id, 
    name, 
    required, 
    className,
    placeholder, 
    value, 
    onChange 
}: TextInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {/* Label a above the input */}
            <label htmlFor={htmlFor || type} className="block text-sm font-semibold text-gray-700 mb-2" hidden={!label}>
                { label }
            </label>
            <div className="relative">
                <input
                    type={showPassword && type == 'password' ? 'text' : type} // This ensures that the obscuring of password only applies to type password
                    id={id || type}
                    name={name || type}
                    required={required}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200 text-gray-950 ${className}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {type == 'password' && 
                    <>
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                    </>
                }
            </div>
        </>
    )
}

export default TextInput
