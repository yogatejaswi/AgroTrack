import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const user = searchParams.get('user');
        if (user) {
            login(JSON.parse(decodeURIComponent(user)));
            navigate('/dashboard');
        } else {
            navigate('/login?error=google_failed');
        }
    }, []);

    return null;
};

export default GoogleAuthSuccess;
