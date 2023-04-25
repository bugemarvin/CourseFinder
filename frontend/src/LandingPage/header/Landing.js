import './Landing.css';
import { Link } from 'react-scroll';



function Landing() {
        return (
                <div className="Landing">
                        <div className="Landing-bg_img"></div>
                        <div className="Landing-cover"></div>
                        <div className="Landing-containers">
                                <div className="Landing-containers-h1">Course Finder</div>
                                <div className="Landing-containers-h3">Discover the world of knowledge</div>
                                <Link to="services" spy={true} smooth={true} offset={-80} duration={500} className="Landing-containers-btn_link">Learn more</Link>
                        </div>
                </div>
        );
}

export default Landing;