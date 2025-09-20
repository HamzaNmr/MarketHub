import { cn } from '@shadcn/lib/utils'
import Autocomplete from '@shadcn/components/autocomplete'

interface SearchInputProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

export default function SearchInput({ 
    value, 
    onChange, 
    placeholder = "Search...", 
    className 
}: SearchInputProps) {
  return (
    <div className={cn("w-xl", className)}>
        <Autocomplete 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
  )
}
