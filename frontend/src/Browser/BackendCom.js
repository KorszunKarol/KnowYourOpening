import axios from "axios";

const config = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function getOpenings(token, allOpenings) {
  const config = {
    headers: { Authorization: "Bearer " + token },
  };
  return axios
    .get(`http://localhost:8080/opening${allOpenings ? "/user" : ""}`, config)
    .then((response) => {
      const openings = {};

      response.data.forEach((el) => {
        openings[el.id] = {
          name: el.name,
          description: el.description,
          moves: el.moveSequence,
          player: el.playerSide
        };
      });
      return openings;
    })
    .catch((error) => {
      console.error("Error fetching openings:", error);
      throw error;
    });
}

export async function deleteOpening(id, token) {
  axios
    .delete(`http://localhost:8080/opening/delete/${id}`, config(token))
    .then((response) => {
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function subscribeOpening(id, token) {
  axios
    .put(`http://localhost:8080/opening/subscribe/${id}`, {}, config(token))
    .then((response) => {
      g(`subscribed opening ${id}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function unsubscribeOpening(id, token) {
  axios
    .delete(`http://localhost:8080/opening/unsub/${id}`, config(token))
    .then((response) => {
      g(`deleted opening ${id}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function PublishOpening(name, moves, info, isWhite, token) {
  try {
    const response = await axios.post(
      "http://localhost:8080/opening",
      {
        name: name,
        moveSequence: moves,
        description: info,
        playerSide: isWhite ? "white" : "black",
      },
      config(token)
    );
    g("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
