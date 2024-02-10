import React from "react";
import { BreadCrumb } from "../../../components/breadcrumb";
import aboutImage from "../../../assets/images/about.jpg";

export const AboutPage = ()=>{
    return (
        <div>
            <BreadCrumb childTitle="about" moduleTitle="About Us"/>
            <div class="page-section">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6 py-3">
                            <h2 class="title-section">The Number #1 Brand Development Service Company</h2>
                            <div class="divider"></div>
                            <p className="text-justify">
                                Welcome to OfferPoint, where creativity meets strategy to bring your brand to life. 
                                We are a dynamic and innovative advertisement agency dedicated to helping businesses thrive in the competitive
                                landscape through powerful and compelling marketing solutions.
                            </p>
                            <p className="text-justify"> 
                                Our team is a powerhouse of creative minds, pushing the boundaries of imagination to deliver
                                campaigns that captivate and resonate. We believe in the power of storytelling, visual aesthetics,
                                and strategic messaging to create advertisements that not only grab attention but also leave a lasting impression.
                            </p>
                            <p className="text-justify">
                                Beyond creativity, we are driven by strategy. We meticulously analyze market trends, consumer behavior, 
                                and your unique business goals to develop tailored advertising campaigns that cut through the noise.
                            </p>
                        </div>
                        <div class="col-lg-6 py-3">
                            <div class="img-fluid py-3 text-center">
                                <img src={aboutImage} className="about-image"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-lg-12">
                            <h2 class="title-section">Our Vision</h2>
                            <div class="divider"></div>
                            <p className="text-justify">
                                At OfferPoint, we envision a world where every brand, regardless of size, can make a lasting impact through
                                effective and memorable advertising. Our mission is to be the catalyst that propels
                                your brand into the hearts and minds of your target audience, creating lasting connections that drive success.
                                constantly push the boundaries, embracing emerging technologies and novel approaches to deliver groundbreaking 
                                campaigns that stand out in a rapidly evolving digital age.
                            </p>
                        </div>
                        <div class="col-lg-12 mt-3">
                            <h2 class="title-section">Our Mission</h2>
                            <div class="divider"></div>
                            <p className="text-justify">
                                At OfferPoint, our mission is to empower brands with impactful and strategic advertising solutions that transcend the ordinary.
                                We are committed to being a driving force behind our clients' success, leveraging our creativity, expertise, and unwavering dedication
                                to deliver campaigns that resonate, captivate, and elevate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}