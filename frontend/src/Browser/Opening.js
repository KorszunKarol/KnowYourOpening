import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { styled } from "@mui/system";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useState } from "react";
import { useOpening } from "./../contexts/OpeningContext";
import { useToken } from "./../contexts/TokenContext";
import OpeningStats from "../components/OpeningStats/OpeningStats";

const Opening = ({
  name,
  id,
  moves,
  description,
  deleteOpening,
  subscribeOpening,
  unsubscribeOpening,
  isUserOpening,
  stats,
  player
}) => {


  const [anchor, setAnchor] = useState(null);

  const { playOpening } = useOpening();
  const { currentToken } = useToken();


  const handleClick = (e) => setAnchor(anchor ? null : e.currentTarget);

  const handleClickAway = () => setAnchor(null);

  const open = Boolean(anchor);



  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="Opening">
        <p>
          {id} : {name}
        </p>
        <div>
          <FontAwesomeIcon
            icon={faCirclePlay}
            onClick={async () =>
              await playOpening({ id, name, moves, description, player })
            }
          />
          <FontAwesomeIcon icon={faCircleInfo} onClick={handleClick} />
          {isUserOpening ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                unsubscribeOpening(id);
              }}
            >
              unsub
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                subscribeOpening(id);
              }}
            >
              sub
            </button>
          )}
          {open && (
            <BasePopup id={id} open={open} anchor={anchor}>
              <PopupBody>{description}</PopupBody>
            </BasePopup>
          )}
        </div>
        <OpeningStats stats={stats} id={id} />
      </div>
    </ClickAwayListener>
  );
}

export default Opening;

const PopupBody = styled("div")(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  background-color: brown;
  color: rgb(0 0 0 / 0.7);
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  z-index: 1;
`
);
