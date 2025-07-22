import "./mobilePage.css";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useGetConfessionsAPIQuery,
  usePostConfessionMutation,
} from "../../redux/slices/tablesSlice";
import { ECATEGORIES, IPostConfession } from "../../interfaces/interfaces";
import {
  detectCategoryFromConfession,
  SUBCATEGORY_KEYWORDS,
} from "../../interfaces/subCategories";
import { PostModal } from "../modals/PostModal";
import {
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export const MobilePage = () => {
  const { data: confessions } = useGetConfessionsAPIQuery();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [post, setPost] = useState<IPostConfession | null>(null);
  const [postConfession, { isLoading }] = usePostConfessionMutation();
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

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: "גבר" | "אישה" | null
  ) => {
    if (newValue !== null) {
      setGender(newValue);
    }
  };

  const handlePost = async () => {
    const validPost = isValidToPost();
    if (!validPost) return;

    try {
      await postConfession(validPost).unwrap();
      setPost(validPost);
      setIsModalOpen(true);
      resetData();
    } catch (e) {
      console.log("❌ Error posting confession: ", e);
    }
  };

  const resetData = () => {
    setConfession("");
    setAge(1);
    setGender(null);
  };

  const isValidToPost = (): false | IPostConfession => {
    if (
      !confession ||
      confession.trim() === "" ||
      !age ||
      age <= 0 ||
      age > 120 ||
      !gender
    )
      return false;
    const post: IPostConfession = {
      confession: confession,
      age: age,
      sex: gender === "אישה" ? "female" : "male",
      category: detectCategoryFromConfession(confession),
    };
    return post;
  };

  const getSubCategory = useCallback(
    (text: string | undefined): string | null => {
      if (!text) return null;
      return (
        Object.entries(SUBCATEGORY_KEYWORDS).find(([_, keywords]) =>
          keywords.some((keyword) => text.includes(keyword))
        )?.[0] || null
      );
    },
    []
  );

  const getAlikeConfessions = useCallback(
    (target: IPostConfession | null) => {
      if (!target || !confessions) return { list: [], amount: 0 };
      const subCat = getSubCategory(target.confession);
      if (!subCat) return { list: [], amount: 0 };
      const list = confessions.filter(
        (conf) =>
          conf.category === target.category &&
          getSubCategory(conf.confession) === subCat &&
          ("id" in target ? conf.id !== target.id : true)
      );
      return { list, amount: list.length };
    },
    [confessions, getSubCategory]
  );

  const getAmountOfCategory = useCallback(
    (category: ECATEGORIES | undefined) =>
      confessions?.filter((conf) => conf.category === category).length,
    [confessions]
  );

  const handleCloseModal = () => {
    setPost(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mobile-wrapper">
      <div className="mobile-animation-wrapper">
        <div className="mobile-confession-animation">
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
      </div>
      <div className="mobile-big-headline">
        <span className="big-headline-small-span">זה בסדר,</span>
        <span className="big-headline-big-span">כולם עושים את זה.</span>
      </div>
      <div className="mobile-content-wrapper">
        <span>מה הדבר הזה שאת.ה עושה,</span>
        <span>אבל לא מספר.ת עליו?</span>
        <textarea
          value={confession}
          className="mobile-input"
          onChange={(e) => setConfession(e.target.value)}
          placeholder="אני אוהב.ת ל..."
          rows={3}
        />
        <span className="mobile-span extend">אל תדאג.י את.ה נשאר.ת אנונימי.ת.</span>
        <span className="mobile-span">הגיל שלי הוא-</span>
        <input
          className="mobile-age-input"
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
        ></input>
        <div className="mobile-gender-buttons-wrapper">
          <span className="mobile-span">ואני-</span>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={handleChange}
            color="primary"
            size="small"
            className="mobile-gender-toggle-group"
          >
            <ToggleButton
              value="גבר"
              className={`mobile-gender-toggle-button ${gender === "גבר" ? "selected" : ""
                } male`}
            >
              גבר
            </ToggleButton>
            <ToggleButton
              value="אישה"
              className={`mobile-gender-toggle-button ${gender === "אישה" ? "selected" : ""
                } female`}
            >
              אישה
            </ToggleButton>
          </ToggleButtonGroup>
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: "2vh",
              justifyContent: "center",
            }}
          >
            <Button
              disabled={!isValidToPost()}
              onClick={handlePost}
              className={`post-button-mobile ${!isValidToPost() ? "disabled" : ""}`}
            >
              {isLoading ? (
                <CircularProgress size={28} color={"inherit"} />
              ) : (
                "שתף"
              )}
            </Button>
          </div>
        </div>
      </div>
      <PostModal
        open={isModalOpen}
        confession={post}
        alikes={getAlikeConfessions(post)?.list}
        amountOfCategory={getAmountOfCategory(post?.category)}
        onClose={handleCloseModal}
        isMobile
      />
    </div>
  );
};
