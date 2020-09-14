import { useState } from 'react';

export const useModalPosition = (left, top, offsetX = 0, offsetY = 0) => {
  /**
   * When a modal is created, get the current scroll position-
   * so we can calculate the absolute position, given the viewport.
   */
  const [scrollLeft] = useState(
    window.pageXOffset !== undefined
      ? window.pageXOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollLeft || 0,
  );
  const [scrollTop] = useState(
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body).scrollTop || 0,
  );

  // TODO: handle offsets for non-pixel values (e.g. rem, em)
  // TODO: should these all be parseInt-ed as well?

  const modalLeft = scrollLeft + parseInt(left) + parseInt(offsetX);
  const modalTop = scrollTop + parseInt(top) + parseInt(offsetY);

  return [modalLeft, modalTop];
};
