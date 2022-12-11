import usePocketbaseAuth from "./usePocketbaseAuth";
import {useNavigate} from "react-router-dom";
import {useEffect} from "preact/compat";

// Redirect a user based on their authentication status
export default function useAuthStatusRedirect(url: string, shouldBeAuthenticated: boolean) {
    // get the pocketbase auth store
    const authStore = usePocketbaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // redirect if the user is logged in
        if (authStore.isValid === shouldBeAuthenticated) {
            // redirect to dashboard
            navigate(url);
        }
    }, [authStore.isValid]);
}