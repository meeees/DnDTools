import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Components.css';
import { useModalPosition } from '@hooks';

/**
 * Creates a modal, positioned absolutely on the page,
 * based on the viewport-relative coordinates provided.
 *
 * @param {number} left number of units (currently px) from the left side of the viewport
 * @param {number} top  number of units (currently px) from the top of the viewport
 */
const Modal = ({ left, top, offsetX, offsetY, children, className, closeModal }) => {
  const [modalLeft, modalTop] = useModalPosition(left, top, offsetX, offsetY);
  const [modalElement] = useState(document.createElement('div'));

  const modalRoot = document.getElementById('modalRoot');
  modalRoot.appendChild(modalElement);

  const styleModal = () => {
    modalElement.style.position = 'absolute';
    modalElement.style.left = `${modalLeft}px`;
    modalElement.style.top = `${modalTop}px`;
    modalElement.className = 'Modal';
    if (className) {
      modalElement.className.concat(` ${className}`);
    }
  };

  const cleanUpModal = () => {
    if (modalElement && modalRoot) {
      try {
        modalRoot.removeChild(modalElement);
      } catch (e) {
        // Do nothing for now
      }
    }
  };
  useEffect(() => {
    styleModal();
    return cleanUpModal;
  }, [modalLeft, modalTop]);

  const [handleBlur] = useState(() => (e) => { if (e.target !== modalElement) { closeModal(); } });
  useEffect(() => {
    document.addEventListener('click', handleBlur);
    return (() => { document.removeEventListener('click', handleBlur); });
  });

  // Now we're thinking with portals! https://www.youtube.com/watch?v=BePtsISQQpk
  return ReactDOM.createPortal(children, modalElement);
};

export default Modal;
