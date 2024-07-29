import React, { useEffect, useState, useCallback } from "react";
import "./Browser.css";
import Opening from "./Opening";
import Search from "./Search";
import { getOpenings, deleteOpening } from "./BackendCom";
import AddBtn from "./AddBtn";
import { useToken } from "./../contexts/TokenContext";
import { subscribeOpening, unsubscribeOpening } from "./BackendCom";
import { useOpening } from "../contexts/OpeningContext";
import { useAppContext } from "../contexts/Context";
import axios from "axios";

const Browser = () => {
  const [openings, setOpenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [showAllOpenings, setShowAllOpenings] = useState(true);
  const { currentToken } = useToken();
  const [stats, setStats] = useState(null);
  const [ids, setIds] = useState(null);
  const { currentOpening } = useOpening();
  const { appState, dispatch } = useAppContext();
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOpening(id, currentToken);
      setTimeout(fetchOpenings, 50);
    } catch (error) {
      console.error("Error deleting opening:", error);
    }
  };

  const handleSubscribe = async (id) => {
    try {
      await subscribeOpening(id, currentToken);
      setTimeout(fetchOpenings, 50);
    } catch (error) {
      console.error("Error subscribing opening:", error);
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      await unsubscribeOpening(id, currentToken);
      setTimeout(fetchOpenings, 50);
    } catch (error) {
      console.error("Error unsubscribing opening:", error);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const fetchOpenings = useCallback(async () => {
    try {
      const response = await getOpenings(currentToken, showAllOpenings);

      setOpenings(response);
    } catch (error) {
      console.error("Error fetching openings:", error);
    }
  }, [currentToken, showAllOpenings]);

  const config = {
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if (currentToken) {
      fetchOpenings();
    }
  }, [currentToken, fetchOpenings]);

  const filteredOpenings = Object.entries(openings)
    .filter(
      ([id, opening]) =>
        opening.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reduce((obj, [id, opening]) => {
      obj[id] = opening;
      return obj;
    }, {});

  const userOpenings = (e) => {
    e.preventDefault();
    setShowAllOpenings((prev) => !prev);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/opening/stats", config)

      .then((response) => {

        setStats(response.data);
        let ids = response.data.map((item) => item.opening);
        setIds(ids);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, [currentToken, currentOpening, appState]);


  return (
    <form className="Browser">
      <div></div>
      <Search onSearch={handleSearch} showSearch={showSearch} />
      <AddBtn
        onAdd={() => {
          setTimeout(fetchOpenings, 50);
          toggleSearch();
        }}
      />{" "}
      <button onClick={userOpenings}>
        {showAllOpenings ? "Show All Openings" : "Show My Openings"}
      </button>
      {filteredOpenings &&
        Object.entries(filteredOpenings)
          .sort(([idA], [idB]) => idA.localeCompare(idB))
          .map(([id, opening]) => {
            const openingStats = stats?.find((stat) => stat.opening === Number(id));
            return (
            <Opening
              key={id}
              id={id}
              name={opening.name}
              moves={opening.moves}
              description={opening.description}
              isUserOpening={showAllOpenings}
              deleteOpening={() => handleDelete(id)}
              subscribeOpening={() => handleSubscribe(id)}
              unsubscribeOpening={() => handleUnsubscribe(id)}
              stats={openingStats}
              player={opening.player}
            />
          );
      })}
    </form>
  );
};

export default Browser;
