import "./confession.css";
import { IConfession } from "../../interfaces/interfaces";

interface ConfessionProps {
  confession: IConfession;
  isOpen: boolean;
  isOpenAsAlike: boolean;
  isHidden: boolean;
  isColumn?: boolean;
  hideAlikes: boolean;
  amountAlikes?: number;
  amountFromSameCategory?: number;
  onClick: (confId: number) => void;
  onOpenAlikes: (conf: IConfession) => void;
}

export const Confession = ({
  confession,
  isOpen,
  isOpenAsAlike,
  isHidden,
  isColumn,
  hideAlikes,
  amountAlikes,
  amountFromSameCategory,
  onClick,
  onOpenAlikes,
}: ConfessionProps) => {
  const handleOnClick = () => {
    if (!isHidden) {
      onClick(confession.id);
    }
  };

  const handleOpenAlikes = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenAlikes(confession);
  };

  return (
    <div
      className={`confession-wrapper  ${isColumn ? "column" : ""} ${
        isOpen ? "opened" : ""
      } ${isOpenAsAlike ? "alike" : ""} ${isHidden ? "hidden" : ""}`}
      onClick={handleOnClick}
      style={{
        position: "relative",
      }}
    >
      <div className="confession-main">
        <span className={`confession-span`}>{confession.confession}</span>
      </div>
      <div
        className="confession-extra-wrapper"
        style={{ display: "flex", gap: isOpen ? "9px" : "0px" }}
      >
        <span
          className={`confession-span extra-info ${isOpen ? "show" : ""}`}
          style={{ paddingRight: isOpen ? "6px" : "0px" }}
        >
          {confession.age}, {confession.sex === "male" ? "גבר" : "אישה"}
        </span>
        {!hideAlikes && (
          <span
            className={`confession-span extra-info linked ${
              isOpen ? "show" : ""
            }`}
            onClick={handleOpenAlikes}
          >
            {amountAlikes} שיתופים דומים
          </span>
        )}
        <span className={`confession-span extra-info ${isOpen ? "show" : ""}`}>
          שהם{" "}
          {amountAlikes && amountFromSameCategory
            ? Math.round((amountAlikes / amountFromSameCategory) * 100)
            : 0}
          % מתוך {amountFromSameCategory} הוידויים של הקטגוריה{" "}
          {confession.category}
          <span style={{ marginLeft: "12px" }}></span>
        </span>
      </div>
    </div>
  );
};
