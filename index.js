const allMatchContainerElm = document.querySelector(".all-matches");
const singleMatchElm = document.querySelector("#match_1");
const addMatchBtnElm = document.querySelector(".lws-addMatch");
const resetBtnElm = document.querySelector(".lws-reset");

const initialState = {
  scores: { match_1: 0 },
  idOfMatches: ["match_1"],
};

//action type
const INCREMENT_SCORE = "increment";
const DECREMENT_SCORE = "decrement";
const RESET = "reset";
const INCREMENT_MATCH = "increment-match";

//action creator
function incrementScore(idOfMatch, value) {
  return {
    type: INCREMENT_SCORE,
    payload: { idOfMatch: idOfMatch, value: Math.abs(value) },
  };
}
function decrementScore(idOfMatch, value) {
  return {
    type: DECREMENT_SCORE,
    payload: { idOfMatch: idOfMatch, value: Math.abs(value) },
  };
}

function reset() {
  return {
    type: RESET,
  };
}
function increment_match(matchId) {
  return {
    type: INCREMENT_MATCH,
    payload: matchId,
  };
}

//reducer
function scoreReducer(state = initialState, action) {
  if (action.type === INCREMENT_SCORE) {
    return {
      ...state,
      scores: {
        ...state.scores,
        [action.payload.idOfMatch]:
          (state.scores[action.payload.idOfMatch] ?? 0) + action.payload.value,
      },
    };
  } else if (action.type === DECREMENT_SCORE) {
    return {
      ...state,
      scores: {
        ...state.scores,
        [action.payload.idOfMatch]:
          (state.scores[action.payload.idOfMatch] ?? 0) -
          (action.payload.value > (state.scores[action.payload.idOfMatch] ?? 0)
            ? state.scores[action.payload.idOfMatch] ?? 0
            : action.payload.value),
      },
    };
  } else if (action.type === RESET) {
    for (let prop in state.scores) {
      state.scores[prop] = 0;
    }
    return {
      ...state,
    };
  } else if (action.type === INCREMENT_MATCH) {
    return {
      ...state,
      idOfMatches: [...state.idOfMatches, action.payload],
    };
  } else {
    return state;
  }
}
const store = Redux.createStore(scoreReducer);

function render() {
  for (const idOfMatch in store.getState().scores) {
    const resultElm = document.querySelector(`#${idOfMatch} .lws-singleResult`);
    resultElm.textContent = store.getState().scores[`${idOfMatch}`];
  }
}

//For rendering first time
render();

store.subscribe(render);

//For resetting
resetBtnElm.addEventListener("click", () => {
  store.dispatch(reset());
});

//Listener for adding new match.
addMatchBtnElm.addEventListener("click", () => {
  //clone singleMatchElm and clean existing value If there is,to reuse element.And add new dynamic id.
  const newMatchElm = singleMatchElm.cloneNode(true);
  newMatchElm.querySelector(".lws-increment").value = null;
  newMatchElm.querySelector(".lws-decrement").value = null;
  newMatchElm.querySelector(".lws-singleResult").textContent = 0;

  //For getting existing match count and setting dynamic id to newly created match.
  numOfExistingMatch = store.getState().idOfMatches.length;
  newMatchElm.setAttribute("id", "match_" + (numOfExistingMatch + 1));
  allMatchContainerElm.appendChild(newMatchElm);
  newMatchElm.querySelector(".lws-matchName").textContent =
    "Match " + (numOfExistingMatch + 1);

  //Dispatch for adding match to redux store .
  store.dispatch(increment_match("match-" + (numOfExistingMatch + 1)));
});

//For input field clearing onblur
function clearField(event) {
  event.target.value = null;
}

//Event delegation
allMatchContainerElm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("incrementForm")) {
    store.dispatch(
      incrementScore(
        event.target.closest(".match").id,
        +event.target.querySelector(".lws-increment").value
      )
    );
  } else {
    render.arguments = [event.target.closest(".match").id];
    store.dispatch(
      decrementScore(
        event.target.closest(".match").id,
        +event.target.querySelector(".lws-decrement").value
      )
    );
  }
});
