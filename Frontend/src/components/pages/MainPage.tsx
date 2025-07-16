import "./mainPage.css";
import { IconButton, Snackbar } from "@mui/material";
import {
  ECATEGORIES,
  EDISPLAYES,
  IConfession,
  IPostConfession,
} from "../../interfaces/interfaces";
import { useGetConfessionsAPIQuery } from "../../redux/slices/tablesSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Confession } from "../confessions/Confession";
import { SUBCATEGORY_KEYWORDS } from "../../interfaces/subCategories";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CONFIG_API } from "../../configs";
import { PostModal } from "../modals/PostModal";
import MuiAlert from "@mui/material/Alert";

export const MainPage = () => {
  const location = useLocation();
  const newConfession = location.state as IPostConfession;
  const [newConfessionAlert, setNewConfessionAlert] =
    useState<IConfession | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { data: confessions } = useGetConfessionsAPIQuery(undefined, {
    pollingInterval: 10000,
  });
  const categories = Object.values(ECATEGORIES);
  const [newConfessionState, setNewConfessionState] =
    useState<IPostConfession | null>(null);
  const [openedConf, setOpenedConf] = useState<number>(-1);
  const [openedAlikesConf, setOpenedAlikesConf] = useState<
    IConfession[] | null
  >();
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState<EDISPLAYES | null>(null);
  const [currCategory, setCurrCategory] = useState<ECATEGORIES | null>(null);
  const confRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const MESSAGE_DURATION = 6000;
  const MOTION_TIME = 1;
  const REF_SCROLL_DELAY = MOTION_TIME * 1000 + 100;
  const CATEGORY_MOTION_TIME = MOTION_TIME - 0.4;
  const navigate = useNavigate();

  useEffect(() => {
    if (openedConf === -1) return;

    const timeout = setTimeout(() => {
      const target = confRefs.current[openedConf];
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }, REF_SCROLL_DELAY);

    return () => clearTimeout(timeout);
  }, [openedConf]);

  useEffect(() => {
    if (!contentWrapperRef.current) return;

    const wrapper = contentWrapperRef.current;
    const scrollToX = ((wrapper.scrollWidth - wrapper.clientWidth) / 2) * -1;

    wrapper.scrollTo({ left: scrollToX, behavior: "smooth", top: 0 });
  }, [display, currCategory]);

  const handleNavigateToControl = () => {
    navigate(CONFIG_API.CONTROL_PAGE);
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

  const sortConfessions = useCallback(
    (type: EDISPLAYES | null): IConfession[] => {
      if (!confessions) return [];

      switch (type) {
        case "age":
          return [...confessions].sort((a, b) => a.age - b.age);
        case "gender":
          return [...confessions].sort((a, b) => a.sex.localeCompare(b.sex));
        case "time":
          return [...confessions].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        default:
          return [...confessions].sort((a, b) => {
            const catCompare = a.category.localeCompare(b.category);
            if (catCompare !== 0) return catCompare;
            return (getSubCategory(a.confession) ?? "").localeCompare(
              getSubCategory(b.confession) ?? ""
            );
          });
      }
    },
    [confessions, getSubCategory]
  );

  const displayedConfessions = useMemo(
    () => sortConfessions(display),
    [display, sortConfessions]
  );

  const handleSetOpenedConf = (confId: number) => {
    setOpenedConf((prev) => (prev === confId ? -1 : confId));
    setOpenedAlikesConf(null);
  };

  const getAmountOfCategory = useCallback(
    (category: ECATEGORIES) =>
      confessions?.filter((conf) => conf.category === category).length,
    [confessions]
  );

  const getAlikeConfessions = useCallback(
    (target: IConfession | IPostConfession | null) => {
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

  const handleOpenAlikes = (conf: IConfession | IPostConfession) => {
    const isOpenedConf: boolean =
      !!("id" in conf) || ("id" in conf && openedConf === conf.id);
    if (openedAlikesConf && isOpenedConf) {
      setOpenedAlikesConf(null);
    } else {
      const alikes = getAlikeConfessions(conf);
      setOpenedAlikesConf(alikes.list);
    }
  };

  const handleSetCurrCategory = (category: ECATEGORIES) => {
    if (category === currCategory) {
      setCurrCategory(null);
    } else {
      setCurrCategory(category);
      setDisplay(null);
      setOpenedConf(-1);
    }
  };

  const resetView = () => {
    setDisplay(null);
    setCurrCategory(null);
    setOpenedConf(-1);
  };

  const handleSetDisplay = (newDisplay: EDISPLAYES) => {
    if (display === newDisplay) {
      resetView();
    } else {
      resetView();
      setDisplay(newDisplay);
    }
  };

  const groupConfessionsByAge = useCallback((confs: IConfession[]) => {
    return confs.reduce<Record<string, IConfession[]>>((acc, conf) => {
      const group =
        conf.age <= 20
          ? "1-20"
          : conf.age <= 30
          ? "21-30"
          : conf.age <= 40
          ? "31-40"
          : conf.age <= 50
          ? "41-50"
          : conf.age <= 60
          ? "51-60"
          : "61+";
      (acc[group] ||= []).push(conf);
      return acc;
    }, {});
  }, []);

  const getGroupByGender = useCallback(
    (gender: "male" | "female") =>
      confessions?.filter((conf) => conf.sex === gender),
    [confessions]
  );

  const genders = ["female", "male"];

  useEffect(() => {
    setNewConfessionState(newConfession ?? null);
  }, [newConfession]);

  const handleCloseModal = () => {
    setNewConfessionState(null);
    navigate(location.pathname, { replace: true, state: null });
  };

  const groupConfessionsByRows = useMemo(() => {
    const itemsPerRow = 9;
    const rows: IConfession[][] = [];
    for (let i = 0; i < displayedConfessions.length; i += itemsPerRow) {
      rows.push(displayedConfessions.slice(i, i + itemsPerRow));
    }

    return rows;
  }, [confessions]);

  const getNewestConfession = useCallback((): IConfession | null => {
    if (!confessions || confessions.length === 0) return null;

    return confessions.reduce((latest, current) => {
      const latestTime = new Date(latest.created_at).getTime();
      const currentTime = new Date(current.created_at).getTime();
      return currentTime > latestTime ? current : latest;
    });
  }, [confessions?.length]);
  const snackbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setNewConfessionAlert(getNewestConfession());
  }, [confessions?.length]);

  useEffect(() => {
    if (!newConfessionAlert) return;

    setShowSnackbar(true);

    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }

    snackbarTimeoutRef.current = setTimeout(() => {
      setShowSnackbar(false);
    }, MESSAGE_DURATION);

    return () => {
      if (snackbarTimeoutRef.current) {
        clearTimeout(snackbarTimeoutRef.current);
        snackbarTimeoutRef.current = null;
      }
    };
  }, [newConfessionAlert]);

  return (
    <motion.div
      className="main-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: MOTION_TIME, ease: "easeInOut" }}
    >
      <div className="main-page-top-part">
        <span className="main-page-headline" onClick={resetView}>
          כולם עושים את זה.
        </span>
        <span
          className="add-one-of-yours"
          style={{ marginTop: "16px" }}
          onClick={handleNavigateToControl}
        >
          + הוספ.י אחד משלך
        </span>
      </div>
      <div className="main-page-content-wrapper" ref={contentWrapperRef}>
        <motion.div
          key={`${display ?? "default"}-${currCategory ?? "all"}`}
          layout
          transition={{ duration: MOTION_TIME, ease: "easeInOut" }}
          className={`main-page-content ${display ?? "default"} ${
            currCategory ? "category" : ""
          }`}
        >
          {(!display || display === EDISPLAYES.TIME) && (
            <AnimatePresence>
              {display === EDISPLAYES.TIME ? (
                displayedConfessions?.map((conf) => {
                  const isOpen = openedConf === conf.id;
                  return (
                    <motion.div
                      layout="position"
                      layoutId={`confession-${conf.id}`}
                      key={conf.id}
                      transition={{
                        duration: MOTION_TIME,
                        ease: "easeInOut",
                      }}
                      className="confession-container"
                      ref={(el) => (confRefs.current[conf.id] = el)}
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 0 }}
                    >
                      <Confession
                        confession={conf}
                        isOpen={isOpen}
                        isOpenAsAlike={
                          openedAlikesConf?.some(
                            (alike) => alike.id === conf.id
                          ) ?? false
                        }
                        isHidden={
                          !currCategory ? false : currCategory !== conf.category
                        }
                        isColumn={display === EDISPLAYES.TIME}
                        hideAlikes={!!display}
                        amountAlikes={getAlikeConfessions(conf).amount}
                        amountFromSameCategory={getAmountOfCategory(
                          conf.category
                        )}
                        onClick={handleSetOpenedConf}
                        onOpenAlikes={handleOpenAlikes}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <AnimatePresence>
                  {groupConfessionsByRows.map((row, rowIndex) => (
                    <motion.div
                      key={rowIndex}
                      className={`confessions-row ${
                        currCategory ? "categorized" : ""
                      }`}
                      layout
                      transition={{
                        duration: currCategory
                          ? MOTION_TIME
                          : CATEGORY_MOTION_TIME,
                      }}
                    >
                      {row.map((conf) => {
                        const isOpen = openedConf === conf.id;
                        const toPresent =
                          !currCategory || currCategory === conf.category;
                        return (
                          toPresent && (
                            <motion.div
                              layout="position"
                              layoutId={`confession-${conf.id}`}
                              key={conf.id}
                              transition={{
                                duration: !currCategory
                                  ? MOTION_TIME
                                  : CATEGORY_MOTION_TIME,
                                ease: "easeInOut",
                              }}
                              className={`confession-container ${
                                isOpen ? "expanded" : ""
                              } ${
                                currCategory === conf.category
                                  ? "categorized"
                                  : ""
                              }`}
                              ref={(el) => (confRefs.current[conf.id] = el)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <Confession
                                confession={conf}
                                isOpen={isOpen}
                                isOpenAsAlike={
                                  openedAlikesConf?.some(
                                    (alike) => alike.id === conf.id
                                  ) ?? false
                                }
                                isHidden={
                                  !currCategory
                                    ? false
                                    : currCategory !== conf.category
                                }
                                isColumn={display === EDISPLAYES.TIME}
                                hideAlikes={!!display}
                                amountAlikes={getAlikeConfessions(conf).amount}
                                amountFromSameCategory={getAmountOfCategory(
                                  conf.category
                                )}
                                onClick={handleSetOpenedConf}
                                onOpenAlikes={handleOpenAlikes}
                              />
                            </motion.div>
                          )
                        );
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </AnimatePresence>
          )}
          {display === EDISPLAYES.AGE &&
            Object.entries(groupConfessionsByAge(displayedConfessions)).map(
              ([groupLabel, groupConfs]) => (
                <div
                  key={groupLabel}
                  // layout
                  className="age-group-wrapper"
                >
                  <motion.div
                    layout
                    transition={{
                      duration: MOTION_TIME,
                      ease: "easeInOut",
                    }}
                    className="confession-container"
                    initial={{ opacity: 0, x: 20, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: 0 }}
                  >
                    <div className="age-group-label">
                      <span>{groupLabel}</span>
                    </div>
                  </motion.div>
                  <motion.div layout className="two-group-container">
                    <motion.div layout className="age-container">
                      <AnimatePresence>
                        {groupConfs.map((conf, index) =>
                          index % 2 !== 0 ? null : (
                            <motion.div
                              layout
                              layoutId={`confession-${conf.id}`}
                              key={conf.id}
                              transition={{
                                duration: MOTION_TIME,
                                ease: "easeInOut",
                              }}
                              className="confession-container"
                              ref={(el) => (confRefs.current[conf.id] = el)}
                              initial={{ opacity: 0, x: 20, y: 0 }}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              exit={{ opacity: 0, x: -20, y: 0 }}
                            >
                              <Confession
                                confession={conf}
                                isOpen={openedConf === conf.id}
                                isOpenAsAlike={
                                  openedAlikesConf?.some(
                                    (alike) => alike.id === conf.id
                                  ) ?? false
                                }
                                isHidden={
                                  !currCategory
                                    ? false
                                    : currCategory !== conf.category
                                }
                                hideAlikes={!!display}
                                amountAlikes={getAlikeConfessions(conf).amount}
                                amountFromSameCategory={getAmountOfCategory(
                                  conf.category
                                )}
                                onClick={handleSetOpenedConf}
                                onOpenAlikes={handleOpenAlikes}
                              />
                            </motion.div>
                          )
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <div className="age-container">
                      <AnimatePresence>
                        {groupConfs.map((conf, index) =>
                          index % 2 === 0 ? null : (
                            <motion.div
                              layout
                              layoutId={`confession-${conf.id}`}
                              key={conf.id}
                              transition={{
                                duration: MOTION_TIME,
                                ease: "easeInOut",
                              }}
                              className="confession-container"
                              ref={(el) => (confRefs.current[conf.id] = el)}
                              initial={{ opacity: 0, x: 20, y: 0 }}
                              animate={{ opacity: 1, x: 0, y: 0 }}
                              exit={{ opacity: 0, x: -20, y: 0 }}
                            >
                              <Confession
                                confession={conf}
                                isOpen={openedConf === conf.id}
                                isOpenAsAlike={
                                  openedAlikesConf?.some(
                                    (alike) => alike.id === conf.id
                                  ) ?? false
                                }
                                isHidden={
                                  !currCategory
                                    ? false
                                    : currCategory !== conf.category
                                }
                                hideAlikes={!!display}
                                amountAlikes={getAlikeConfessions(conf).amount}
                                amountFromSameCategory={getAmountOfCategory(
                                  conf.category
                                )}
                                onClick={handleSetOpenedConf}
                                onOpenAlikes={handleOpenAlikes}
                              />
                            </motion.div>
                          )
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              )
            )}

          {display === EDISPLAYES.GENDER && (
            <AnimatePresence>
              {genders.map((gender, index) => {
                return (
                  <div
                    key={index}
                    className={`gender-half-wrapper ${
                      gender === "male" ? "left" : ""
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ duration: MOTION_TIME, ease: "easeInOut" }}
                      className="confession-container"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                    >
                      {gender === "male" && (
                        <span style={{ marginLeft: "28px" }}>גברים</span>
                      )}
                    </motion.div>
                    <div
                      className={`gender-half ${
                        gender === "female" ? "right" : ""
                      }`}
                    >
                      {getGroupByGender(
                        gender === "female" ? "female" : "male"
                      )?.map((conf) => {
                        const isOpen = openedConf === conf.id;
                        return (
                          <motion.div
                            layout
                            layoutId={`confession-${conf.id}`}
                            key={conf.id}
                            transition={{
                              duration: MOTION_TIME,
                              ease: "easeInOut",
                            }}
                            className="confession-container"
                            ref={(el) => (confRefs.current[conf.id] = el)}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                          >
                            <Confession
                              confession={conf}
                              isOpen={isOpen}
                              isOpenAsAlike={
                                openedAlikesConf?.some(
                                  (alike) => alike.id === conf.id
                                ) ?? false
                              }
                              isHidden={
                                !currCategory
                                  ? false
                                  : currCategory !== conf.category
                              }
                              hideAlikes={!!display}
                              amountAlikes={getAlikeConfessions(conf).amount}
                              amountFromSameCategory={getAmountOfCategory(
                                conf.category
                              )}
                              onClick={handleSetOpenedConf}
                              onOpenAlikes={handleOpenAlikes}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                    <motion.div
                      layout
                      transition={{ duration: MOTION_TIME, ease: "easeInOut" }}
                      className="confession-container"
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 0 }}
                    >
                      {gender === "female" && (
                        <span style={{ marginRight: "20px" }}>נשים</span>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
      <div className="main-page-bottom-part">
        <div className="bottom-part-right-part">
          {categories.map((cat, index) => {
            return (
              <IconButton
                key={index}
                onClick={() => handleSetCurrCategory(cat)}
                disableRipple
              >
                <span
                  className="add-one-of-yours"
                  style={{
                    textDecoration: currCategory === cat ? "underline" : "none",
                  }}
                >
                  {cat}
                </span>
              </IconButton>
            );
          })}
        </div>
        <div className="bottom-part-left-part">
          <IconButton
            onClick={() => handleSetDisplay(EDISPLAYES.GENDER)}
            disableRipple
          >
            <span
              className="add-one-of-yours"
              style={{
                textDecoration:
                  display === EDISPLAYES.GENDER ? "underline" : "none",
              }}
            >
              מגדר
            </span>
          </IconButton>
          <IconButton
            disableRipple
            onClick={() => handleSetDisplay(EDISPLAYES.AGE)}
          >
            <span
              className="add-one-of-yours"
              style={{
                textDecoration:
                  display === EDISPLAYES.AGE ? "underline" : "none",
              }}
            >
              גיל
            </span>
          </IconButton>
          <IconButton
            disableRipple
            onClick={() => handleSetDisplay(EDISPLAYES.TIME)}
          >
            <span
              className="add-one-of-yours"
              style={{
                textDecoration:
                  display === EDISPLAYES.TIME ? "underline" : "none",
              }}
            >
              זמן
            </span>
          </IconButton>
        </div>
      </div>
      <PostModal
        open={newConfessionState !== null}
        confession={newConfessionState}
        alikes={getAlikeConfessions(newConfessionState)?.list}
        amountOfCategory={getAmountOfCategory(newConfession?.category)}
        onOpenAlikes={handleOpenAlikes}
        onClose={handleCloseModal}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={MESSAGE_DURATION}
        TransitionProps={{ timeout: 1200 }}
        onMouseEnter={() => {
          if (snackbarTimeoutRef.current) {
            clearTimeout(snackbarTimeoutRef.current);
          }
        }}
        onMouseLeave={() => {
          snackbarTimeoutRef.current = setTimeout(() => {
            setShowSnackbar(false);
          }, MESSAGE_DURATION);
        }}
        sx={{
          position: "absolute !important",
          right: `240px !important`,
          top: `25px !important`,
        }}
      >
        <MuiAlert
          elevation={0}
          variant="outlined"
          severity="info"
          icon={false}
          // onClose={() => setShowSnackbar(false)}
          sx={{
            width: "100%",
            borderColor: "white",
            color: "white",
            gap: "14px",
            padding: "0px 15px 0px 20px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <div className="message-text">
            <strong>•</strong>{" "}
            <span onClick={() => setOpenedConf(newConfessionAlert?.id ?? -1)}>
              נכנס וידוי חדש
            </span>
          </div>
        </MuiAlert>
      </Snackbar>
    </motion.div>
  );
};
