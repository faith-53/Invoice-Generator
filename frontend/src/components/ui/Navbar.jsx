import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';


const Navbar = () => {
    const { logoutUser, token } = useAuth();
    const navigate = useNavigate();
    

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };
  return (
    <nav className="navbar navbar-expand-lg bg-dark d-flex justify-between fixed-top">
        <div className="container-fluid">
            <Link className="navbar-brand text-white fw-bold" to="/">InvoicePro</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu" >
            <span className="navbar-toggler-icon" id='navmenu'></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navmenu">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <Link className="nav-link active text-white" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link text-white" to="/invoices">Invoices</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link text-white" href="#">Clients</Link>
                    </li>
                    
                </ul>
            </div>
            <div>
                {token ? (
                    <button 
                        className='btn btn-danger'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/register" className='btn btn-primary me-2'>Sign Up</Link>
                        <Link to="/login" className='btn btn-primary'>Sign In</Link>
                    </>
                )}
            </div>
        </div>
    </nav>
  )
}

export default Navbar