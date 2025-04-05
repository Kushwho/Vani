import { ReactNode } from "react"

interface GoogleWrapperProps {
  children: ReactNode;
}

const GoogleWrapper = ({ children }: GoogleWrapperProps) => (
    <div>
        {children}
    </div>
)

export default GoogleWrapper