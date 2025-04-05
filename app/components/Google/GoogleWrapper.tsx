import { GoogleOAuthProvider } from "@react-oauth/google"
import { ReactNode } from "react"

interface GoogleWrapperProps {
  children: ReactNode;
}

const GoogleWrapper = ({ children }: GoogleWrapperProps) => (
    <GoogleOAuthProvider clientId="885631174114-gspnjd2i7giuf681hkido7m6jdegbp7c.apps.googleusercontent.com">
        {children}
    </GoogleOAuthProvider>
)

export default GoogleWrapper