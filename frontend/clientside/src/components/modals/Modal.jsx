import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, open }) => {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    }
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      className="max-h-[100vh] p-4 font-bold mt-5 backdrop:bg-opacity-50 backdrop:bg-slate-800 min-w-80 rounded-md"
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
