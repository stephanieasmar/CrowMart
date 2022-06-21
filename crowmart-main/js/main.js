let state = {
  count: 0,
  totalPrice: 0,
  get: () => {
    if (sessionStorage.getItem("state")) {
      let st = sessionStorage.getItem("state");
      let saved = JSON.parse(st);
      return saved;
    } else return state;
  },
  set: (state) => {
    if (sessionStorage.getItem("state")) {
      sessionStorage.removeItem("state");
      sessionStorage.setItem("state", JSON.stringify(state));
    } else sessionStorage.setItem("state", JSON.stringify(state));
  },
};

let savedState = state.get();

let getPageInfo = (currentUrl) => {
  debugger;
  let prevPage = localStorage.getItem("prevPage");
  if (prevPage && prevPage != currentUrl) {
    localStorage.removeItem("prevPage");
    localStorage.setItem("prevPage", currentUrl);
  } else localStorage.setItem("prevPage", currentUrl);
  return prevPage;
};

let blackCrowAPIRequest = () => {
  let currentUrl = window.location.href;
  debugger;

  let requestData = {
    site_name: "BLACKCROW",
    page_id: "other",
    visitor_id: "84y3th",
    site_country: "US",
    site_language: "EN",
    site_currency: "USD",
    page_title: document.title,
    page_url: currentUrl,
    page_referrer_url: getPageInfo(currentUrl),
    device_info: navigator.userAgent,
  };

  fetch("https:api.sandbox.blackcrow.ai/v1/events/view", {
    method: "POST",
    body: JSON.stringify(requestData),
  })
    .then((res) => {
      debugger;
      // The API call was successful!
      console.log("success!", res);
    })
    .catch((err) => {
      debugger;
      // There was an error
      console.warn("Something went wrong.", err);
    });
};

window.onload = () => {
  blackCrowAPIRequest();
  let pathName = window.location.pathname.slice(-9);
  if (pathName === "cart.html") {
    let count = document.getElementById("count");
    let total = document.getElementById("total");
    if (count && total) {
      updateCart(savedState);
    }
  }
};

document.addEventListener(
  "click",
  (event) => {
    let element = event.target;
    let siblings = getSiblings(element);
    updateState(siblings, savedState);
  },
  false
);

let getSiblings = (element) => {
  let siblings = [];
  let sibling = element.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== element) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

let updateState = (siblings, savedState) => {
  let newState = savedState;
  for (sibling of siblings) {
    if (sibling.tagName === "H5") {
      let parsedPrice = parseInt(sibling.innerHTML.replace(/\$/g, ""), 10);
      newState.totalPrice += parsedPrice;
      newState.count++;
      state.set(newState);
    }
  }
};

let updateCart = (savedState) => {
  let st = savedState;
  document.getElementById(
    "count"
  ).innerHTML = `You have ${st.count} items in cart`;
  document.getElementById("total").innerText = `Total: $ ${st.totalPrice}`;
};
