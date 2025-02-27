import logo from "../images/logo.png";
import banner from "../images/banner.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../App.css";

const Navbar = () => {
    return (
        <header className="header">
            <nav>
                <div className="logo-container">
                    <a href="/clientsurvey" className="logo-link" >
                    <img src={banner} alt="Logo" className="bannerheader"/>
                    </a>
                </div>
            </nav>
            <nav>
                <div className="logo-container">
                    <a href="/clientsurvey" className="logo-link" >
                    <img src={logo} alt="Logo" className="logo1"/>
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;