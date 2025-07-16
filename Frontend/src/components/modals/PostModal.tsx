import "../pages/mainPage.css";
import { Modal, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IConfession, IPostConfession } from "../../interfaces/interfaces";
import React from "react";

interface MyModalProps {
  open: boolean;
  confession?: IPostConfession | null;
  alikes?: IConfession[];
  amountOfCategory?: number;
  isMobile?: boolean;
  onOpenAlikes?: (conf: IPostConfession) => void;
  onClose: () => void;
}

export const PostModal = ({
  open,
  confession,
  alikes,
  amountOfCategory,
  isMobile,
  onOpenAlikes,
  onClose,
}: MyModalProps) => {
  const handleOpenAlikes = () => {
    if (onOpenAlikes && confession && alikes && alikes.length > 0) {
      onOpenAlikes(confession);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(2, 2, 2, 1)",
          color: "#fff",
          borderRadius: "12px",
          boxShadow: 24,
          p: 6,
          minWidth: isMobile ? "100%" : 700,
          maxWidth: isMobile ? "100%" : 1000,
          height: isMobile ? "100%" : "auto",
          textAlign: "center",
          alignContent: "center",
          fontFamily: "Rubik, sans-serif"
        }}
      >
        {!isMobile && (
          <React.Fragment>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                color: "#fff",
              }}
              size="small"
            >
              <CloseIcon fontSize={"medium"} />
            </IconButton>
            <span
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                color: "rgba(255, 255, 255, 0.82)",
                fontSize: "15px",
              }}
            >
              נכנס וידוי חדש
            </span>
          </React.Fragment>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            maxHeight: "50px",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "65px",
            }}
          >
            {`"`}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              maxWidth: "70%",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "28px" : "32.5px",
                textWrap: "wrap",
              }}
            >
              {confession?.confession}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            gap: "70px",
            color: "rgba(255, 255, 255, 0.88)",
            fontSize: isMobile ? "20px" : "22px",
            margin: "18px 0px 8px 0px",
          }}
        >
          <span>
            {confession?.age}, {confession?.sex === "male" ? "גבר" : "אישה"}
          </span>
          <span
            onClick={handleOpenAlikes}
            className={alikes && alikes.length > 0 ? "hovered-span" : "span"}
            style={{
              textDecoration:
                alikes && alikes.length > 0 && !isMobile ? "underline" : "",
              cursor: alikes && alikes.length > 0 && !isMobile ? "pointer" : "",
            }}
          >
            יש {alikes?.length ?? 0} דומים
          </span>
        </div>
        <div
          style={{
            marginTop: "10px",
            marginBottom: isMobile ? "22vh" : "12px",
          }}
        >
          <span
            style={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.88)" }}
          >
            שהם{" "}
            {alikes && amountOfCategory
              ? Math.round((alikes.length / amountOfCategory) * 100)
              : 0}
            % מתוך {amountOfCategory} הוידויים של הקטגוריה{" "}
            {confession?.category}
          </span>
        </div>
        {isMobile && (
          <div style={{ display: "flex" }}>
            <Button
              onClick={onClose}
              className={`post-button-mobile`}
              sx={{ position: "absolute", bottom: "4vh", right: "3.5%", width: "92% !important" }}
            >
              סגור
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
};
