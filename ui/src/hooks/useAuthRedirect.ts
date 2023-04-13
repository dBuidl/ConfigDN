import useAuthValid from "./useAuthValid";
import {useNavigate} from "react-router-dom";
import {useEffect} from "preact/compat";

// Redirect a user based on their authentication status
// url: The URL to redirect to if the user's `authValid` matches `ifAuthValidEquals`
export default function useAuthRedirect(url: string, ifAuthValidEquals: boolean) {
    // get the pocketbase auth store
    const authValid = useAuthValid();
    const navigate = useNavigate();

    useEffect(() => {
        // redirect if the user is logged in
        if (authValid === ifAuthValidEquals) {
            // redirect to dashboard
            navigate(url);
        }
    }, [authValid]);
}