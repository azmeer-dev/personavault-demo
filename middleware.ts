import {withAuth} from "next-auth/middleware"

//FOR PROTECTED ROUTES IN (protectedRoutes) FOLDER

export default withAuth({
    pages: {
        //redirect to login page
        signIn: "/login"
    },
});

export const config = {
    matcher: [
        //define the protected routes 
        "/dashboard/:path*",
        "/settings/:path*",
        "/connected-accounts/:path*",
    ]
}