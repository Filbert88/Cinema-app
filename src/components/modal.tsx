import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string; 
  inputValue: string;
  onInputChange: (value: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText,
  inputValue,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black p-4 rounded-lg border-[3px] border-[#64ffda] flex flex-col gap-4 max-w-[500px]">
        <h1 className="font-bold text-3xl text-center">{title}</h1>
        <h3 className="text-2xl text-center">{description}</h3>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter amount"
          className="border rounded-lg p-3 text-black"
        />
        <div className="flex flex-row justify-center gap-4">
          <button onClick={onClose} className="border-2 border-red text-red p-3 rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="border-2 border-[#64ffda] text-[#64ffda] p-3 rounded-lg">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
