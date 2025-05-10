import React from 'react'
import {Link} from 'react-router-dom'


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand" href="#">INVOICE GENERATOR</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu" >
            <span className="navbar-toggler-icon" id='navmenu'></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navmenu">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" href="#">Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" href="#">Invoices</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" href="#">Clients</Link>
                    </li>
                    
                </ul>
            </div>
            <div>
                <button className='btn btn-primary'>SignUp</button>
                <button className='btn btn-primary'>Sign In</button>
                <Link></Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar