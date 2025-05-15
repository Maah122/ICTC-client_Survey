import logo from "../images/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../App.css";

const Navbar = () => {
    return (
        <header className="header">
            <nav>
                <div className="logo-container">
                    <a href="homepage.html" className="logo-link" >
                    <img src={logo} alt="Logo" className="logo"/>
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
