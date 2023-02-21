const allMatchContainerElm = document.querySelector(".all-matches");
const singleMatchElm = document.querySelector("#match_1");
const addMatchBtnElm = document.querySelector(".lws-addMatch");
const resetBtnElm = document.querySelector(".lws-reset");

function matchTemplateCreator(matchNum) {
  return `<div id=${`match_${matchNum + 1}`} class="match">
          <div class="wrapper">
            <button class="lws-delete">
              <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${matchNum + 1}</h3>
          </div>
          <div class="inc-dec">
            <form class="incrementForm">
              <h4>Increment</h4>
              <input
                onblur="clearField(event)"
                type="number"
                name="increment"
                class="lws-increment"
              />
            </form>
            <form class="decrementForm">
              <h4>Decrement</h4>
              <input
                onblur="clearField(event)"
                type="number"
                name="decrement"
                class="lws-decrement"
              />
            </form>
          </div>
          <div class="numbers">
            <h2 class="lws-singleResult">0</h2>
          </div>
        </div>
      </div>`;
}

const initialState = {
  scores: { match_1: 0 },
};

//action type
const INCREMENT_SCORE = "increment";
const DECREMENT_SCORE = "decrement";
const RESET = "reset";

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
  } else {
    return state;
  }
}
const store = Redux.createStore(scoreReducer);

function render() {
  const AllExistingMatchResultRef =
    document.querySelectorAll(".lws-singleResult");
  AllExistingMatchResultRef.forEach((SingleResultRef, index) => {
    SingleResultRef.textContent =
      store.getState().scores[`match_${index + 1}`] ?? 0;
  });
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
  const numOfExistingMatch = allMatchContainerElm.children.length;
  allMatchContainerElm.insertAdjacentHTML(
    "beforeend",
    matchTemplateCreator(numOfExistingMatch)
  );
});

//For input field clearing onblur.
function clearField(event) {
  event.target.value = null;
}

//Event delegation for submit.
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
