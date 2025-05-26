import {useEffect, useState} from 'react'
import api from '../services/api'; 
import { jwtDecode } from "jwt-decode";
import { Navigate } from 'react-router-dom';


const ProtectedRoute = (children) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    let accessToken = localStorage.getItem('accessToken') || null;
    useEffect(() => {
        const authenticate = async () => {
                try {
                    await auth();
                } catch {
                    setIsAuthenticated(false);
                }
            };
            authenticate();
        
    });

    const refreshAccessToken = async () => {
            try{
                const response = await api.get('api/token/refresh', {withCredentials: true ,refreshToken: refreshAccessToken});
                if (response.status ===200) {
                    console.log(response.data.accessToken)
                    setIsAuthenticated(true)
                } else {
                    setIsAuthenticated(false)
                }
            }catch (error) {
                console.error("Error refreshing token:", error);
                setIsAuthenticated(false)
            }
    };


    const auth = async () => {
        const token = accessToken
        if (!token) {
            setIsAuthenticated(false)
            return false
        }

        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decodedToken.exp < now) {
            await refreshAccessToken();
        } else {
            setIsAuthenticated(true);
        }

    }


    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  
}

export default ProtectedRoute
