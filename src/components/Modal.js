import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Components.css';

const Modal = ({ showModal, onClose, children, className }) => {
  if (!showModal) {
    return null;
  }

  // useEffect(() => {
  //   return onClose;
  // }, []);

  return (
    <div className="ModalHolder">
      <div className={`Modal ${className}`}>{children}</div>
    </div>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.any,
  className: PropTypes.string,
};

export default Modal;
