import React,{useState} from "react";
import * as yup from 'yup';
import { BreadCrumb } from "../../../components/breadcrumb";
import {useFormValidation} from '../../../core/hooks/useFormValidation';
import {WrapErrorMessage, ErrorMessage, getErrorClass} from '../../../components/error-message';
import { ContactModel } from "../../../core/models/contact-model";
import contactService from '../service';

const CONTACT_FORM_VALIDATION_SCHEMA = yup.object({
    Email : yup.string().nullable().email('invalid email').required('required'),
    Message :  yup.string().nullable().required('required')
});

export const ContactPage = ()=>{
    const [contact, setContact] = useState(new ContactModel());
    const {isValid, errors, onValidate} = useFormValidation(CONTACT_FORM_VALIDATION_SCHEMA);
    const Error = WrapErrorMessage(ErrorMessage, errors);

    const onChange = (value = {}) => {
        const constructValues = {...contact, ...value};
        onValidate(constructValues);
        setContact(constructValues);
    } 

    const onSave = ()=>{
        onValidate(contact).then((isFormValid)=>{
            if(isFormValid){
                contactService.createContactMessage(contact).then(()=>{
                    setContact(new ContactModel());
                })
            }
        })
    }

    return (
        <div>
            <BreadCrumb childTitle="contact" moduleTitle="Contact Us"/>

            <div class="page-section">
                <div class="container">
                    <div class="row text-center align-items-center">
                        <div class="col-lg-4 py-3">
                        <div class="display-4 text-center text-primary">
                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                        </div>
                        <p class="mb-3 font-weight-medium text-lg">Address</p>
                        <p class="mb-0 text-secondary">48/130, Dharmasala Mawatha, Obesekarapura, Rajagiriya, LK.</p>
                        </div>
                        <div class="col-lg-4 py-3">
                            <div class="display-4 text-center text-primary">
                                <i class="fa fa-mobile" aria-hidden="true"></i>
                            </div>
                                <p class="mb-3 font-weight-medium text-lg">Phone</p>
                                <p class="mb-0"><a href="tel:94757320304" class="text-secondary">+94 7573 203 04</a></p>
                            </div>  
                        <div class="col-lg-4 py-3">
                            <div class="display-4 text-center text-primary">
                            <i class="fa fa-envelope-o" aria-hidden="true"></i>
                            </div>
                                <p class="mb-3 font-weight-medium text-lg">Email Address</p>
                                <p class="mb-0"><a href="mailto:mhm.hazeer.lk@gmail.com" class="text-secondary">mhm.hazeer.lk@gmail.com</a></p>
                            </div>
                    </div>
                    <div className="row align-items-center">
                        <div class="col-lg-12">
                            <div class="contact-form py-5 px-lg-5">
                                <h2 class="mb-4 font-weight-medium text-secondary">Get in touch</h2>

                                <div class="row form-group">
                                    <div class="col-md-12">
                                        <label class="text-black" for="email">Name</label>
                                        <input type="text" class="form-control" value={contact.Name} onChange={(e)=> onChange({Name: e.target.value})}/>
                                    </div>
                                </div>
                        
                                <div class="row form-group">
                                    <div class="col-md-12">
                                        <label class="text-black" for="email">Email</label>
                                        <input type="text" id="email" class={`form-control ${getErrorClass('Email',errors)}`} value={contact.Email} onChange={(e)=> onChange({Email: e.target.value})}/>
                                        <Error property="Email"/>
                                    </div>
                                </div>
                        
                                <div class="row form-group">
                        
                                <div class="col-md-12">
                                    <label class="text-black" for="subject">Subject</label>
                                    <input type="text" id="subject" class="form-control" value={contact.Subject} onChange={(e)=> onChange({Subject: e.target.value})}/>
                                </div>
                                </div>
                        
                                <div class="row form-group">
                                <div class="col-md-12">
                                    <label class="text-black" for="message">Message</label>
                                    <textarea name="message" id="message" cols="30" rows="5" class={`form-control ${getErrorClass('Message',errors)}`}  placeholder="Write your notes or questions here..." value={contact.Message} onChange={(e)=> onChange({Message: e.target.value})}></textarea>
                                    <Error property="Message"/>
                                </div>
                                </div>
                        
                                <div class="row form-group mt-4">
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" disabled={!isValid} onClick={onSave}>Send Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mt-3">
                            <div class="maps-container">
                                <div id="google-maps">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.590444816098!2d79.84483925924111!3d6.902846641796493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25961265f9517%3A0x70b4d5a5cf6c452e!2sBambalapitiya%2C%20Colombo!5e0!3m2!1sen!2slk!4v1705084826358!5m2!1sen!2slk" style={{height:400}} className="w-100 border-0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}