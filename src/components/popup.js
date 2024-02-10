import React from "react";
import {Modal} from 'react-bootstrap';

export const PopUp = (props)=>{
    return (
        <Modal show={props.show} onHide={props.onClose} centered size="lg" backdrop="static" className={props.className}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
        </Modal>
    );
}