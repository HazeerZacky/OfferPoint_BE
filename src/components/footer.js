import React from "react";
import { Link } from "react-router-dom";

export const Footer = (props) => {
    return (
        <footer className="page-footer bg-image">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-lg-3 py-3">
                        <h3>OfferPoint</h3>
                        <p>
                            Welcome to OfferPoint, where creativity meets strategy to bring your brand to life. 
                        </p>
                        <div className="social-media-button">
                            <a href="#" target="_blank" className="mr-1"> <i class="fa fa-facebook "></i></a>
                            <a href="#" target="_blank" className="mr-1"><i class="fa fa-twitter "></i></a>
                            <a href="#" target="_blank" className="mr-1"><i class="fa fa-google-plus"></i></a>
                            <a href="#" target="_blank" className="mr-1"><i class="fa fa-instagram "></i></a>
                            <a href="#" target="_blank" className="mr-1"><i class="fa fa-youtube-play "></i></a>
                        </div>
                    </div>
                    <div className="col-lg-3 py-3">
                        <h5>Quick Links</h5>
                        <ul className="footer-menu">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/brands">Brands</Link></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Help & Support</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 py-3">
                        <h5>Contact Us</h5>
                        <p>48/130, Dharmasala Mawatha, Obesekarapura, Rajagiriya, LK.</p>
                        <a href="tel:94757320304" className="footer-link">+94 7573 203 04</a>
                        <a href="mailto:mhm.hazeer.lk@gmail.com" className="footer-link">mhm.hazeer.lk@gmail.com</a>
                    </div>
                    <div className="col-lg-3 py-3">
                        <h5>Join Us</h5>
                        <p>
                            At OfferPoint, our vision is not just a statement; it's a call to action.
                            We invite you to join us on this exciting journey as we shape the future of advertising.
                        </p>
                    </div>
                </div>
                <p className="text-center" id="copyright">
                    Copyright &copy; 2024. Design and Develop by <a href="https://www.linkedin.com/in/hazeerzacky/" target="_blank">Mohammed Hazeer Zacky </a>
                </p>
            </div>
        </footer>
    );
};