import { Link } from "react-router-dom";
const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
                {/* <nav className="navbar bg-primary" data-bs-theme="dark"> */}
                {/* <div className="container-fluid"> */}
                <div className="Col-md-6" id="Col" >
                    <img src="/src/assets/logo.png" alt="App preview" className="img-fluid" />
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            {/* <a className="nav-link active" href="#">Home</a> */}
                            <Link className="nav-link" to="/Home">
                                Home
                            </Link>
                        </li>
                        <br />
                        <li className="nav-item">
                            <a className="nav-link" href="#services">Nos services</a>

                        </li>
                        <br />
                        <br />

                        <li className="nav-item">
                            <Link className="nav-link" to="/Medicament">
                                Voir les medicaments
                            </Link>

                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Contact">
                                Contact us
                            </Link>
                        </li>
                    </ul>
                </div>

                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </nav>


        </>
    );

};
export default Header;
