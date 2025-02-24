import { JSX } from "react";

interface GreyButtonProps {
  styles: string;
  text: string | JSX.Element;
  onClick: () => void;
  loadingText: string | JSX.Element;
  loading: boolean;
}

const GreyButton: React.FC<GreyButtonProps> = ({ styles, text, loading, onClick }) => {
  return (
    <button className={`bg-[#333333] font-semibold hover:bg-[#262626] ${styles}`} onClick={onClick}>
      {loading ? <span className="spinner" /> : text}
    </button>
  );
};

export default GreyButton;
