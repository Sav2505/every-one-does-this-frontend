import { useNavigate } from "react-router-dom";
import "./controlPage.css";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG_API } from "../../configs";
import {
  useGetConfessionsAPIQuery,
  usePostConfessionMutation,
} from "../../redux/slices/tablesSlice";
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { IPostConfession } from "../../interfaces/interfaces";
import { detectCategoryFromConfession } from "../../interfaces/subCategories";

export const ControlPage = () => {
  const navigate = useNavigate();
  const [showNote, setShowNote] = useState<boolean>(false);
  const { data: confessions } = useGetConfessionsAPIQuery();
  const [postConfession, { isLoading, isError }] = usePostConfessionMutation();
  const [currIndex, setCurrIndex] = useState(0);
  const INTERVAL_TIME = 7500;
  const [gender, setGender] = useState<"גבר" | "אישה" | null>();
  const [confession, setConfession] = useState<string>("");
  const [age, setAge] = useState<number>();

  useEffect(() => {
    if (!confessions || confessions.length === 0) return;

    const interval = setInterval(() => {
      setCurrIndex((prev) => (prev + 1) % confessions.length);
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [confessions]);

  const currentText = confessions?.[currIndex]?.confession ?? "";

  const handleNavigateToMainPage = () => {
    navigate(CONFIG_API.MAIN_PAGE);
  };

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: "גבר" | "אישה" | null
  ) => {
    if (newValue !== null) {
      setGender(newValue);
    }
  };

  const handlePost = async () => {
    if (!isValidToPost()) {
      setShowNote(true);
      return;
    }

    const confessionToPost: IPostConfession = {
      confession: confession,
      age: age ?? 20,
      sex: gender === "אישה" ? "female" : "male",
      category: detectCategoryFromConfession(confession),
    };

    try {
      await postConfession(confessionToPost).unwrap();
      navigate(CONFIG_API.MAIN_PAGE, { state: confessionToPost });
      setShowNote(false);
    } catch (e) {
      console.log("❌ Error posting confession: ", e);
    }
  };

  const isValidToPost = (): boolean => {
    return !!(
      confession.trim() !== "" &&
      age &&
      age > 0 &&
      age <= 120 &&
      gender
    );
  };

  return (
    <motion.div
      className="control-page-wrapper"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="main-page-top-part">
        <span className="main-page-headline" onClick={handleNavigateToMainPage}>
          כולם עושים את זה.
        </span>
        <span className="control-add-one-of-yours">+ הוספ.י אחד משלך</span>
      </div>
      <div className="control-page-content">
        <div className="control-right-part">
          <div className="confession-animation">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentText}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 3 }}
                className="confession-text"
              >
                {currentText}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="big-headline">
            <span className="big-headline-small-span-control">זה בסדר,</span>
            <span className="big-headline-big-span-control">כולם עושים</span>
            <span className="big-headline-big-span-control">את זה.</span>
          </div>
          <div className="back-button" onClick={handleNavigateToMainPage}>
            <div className="arrow-line"></div>
            <span>חזור.י</span>
          </div>
        </div>
        <div className="control-left-part">
          <span style={{ marginTop: "5%" }}>
            מה הדבר הזה שאת.ה עושה, אבל לא מספר.ת עליו?
          </span>
          <input
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder="אני אוהב.ת ל..."
          ></input>
          <span className="span_1">אל תדאג.י את.ה נשאר.ת אנונימי.ת.</span>
          <div style={{ marginTop: "2%" }}>
            <span className="span_1">הגיל שלי הוא-</span>
            <input
              value={age}
              min={1}
              max={120}
              onChange={(e) => {
                const num = Number(e.target.value);
                if (num >= 1 && num <= 120) {
                  setAge(num);
                } else if (e.target.value === "") {
                  setAge(Number(""));
                }
              }}
              style={{ marginRight: "30px", maxWidth: "300px" }}
            ></input>
          </div>
          <div style={{ marginTop: "9%" }}>
            <span className="gender-span">ואני-</span>
            <ToggleButtonGroup
              value={gender}
              exclusive
              onChange={handleChange}
              color="primary"
              size="small"
              className="gender-toggle-group"
            >
              <ToggleButton
                value="גבר"
                className={`gender-toggle-button ${
                  gender === "גבר" ? "selected" : ""
                } male`}
              >
                גבר
              </ToggleButton>
              <ToggleButton
                value="אישה"
                className={`gender-toggle-button ${
                  gender === "אישה" ? "selected" : ""
                } female`}
              >
                אישה
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Button
            onClick={handlePost}
            className={`post-button-control ${
              !isValidToPost() ? "disabled" : ""
            }`}
          >
            {isLoading ? (
              <CircularProgress size={28} color={"inherit"} />
            ) : (
              "שתף"
            )}
          </Button>
          {isError && (
            <span style={{ marginTop: "12px", fontSize: "16px" }}>
              * אירעה תקלה בשיתוף הוידוי, אנא נסה.י שוב / נסה.י מאוחר יותר :)
            </span>
          )}
          {showNote && (
            <span style={{ marginTop: "12px", fontSize: "16px" }}>
              * חסרים כמה פרטים, כולם ממלאים את זה :)
            </span>
          )}
          <div style={{ marginBottom: "20px" }}></div>
        </div>
      </div>
    </motion.div>
  );
};
