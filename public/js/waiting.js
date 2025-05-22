async function routeTarget(e) {
  const t = "https://hitenant-api.vwr-exv.click/target_routing",
    n = new URLSearchParams(window.location.search).get("token");
  if (n) {
    localStorage.setItem("token", n);
  }
  try {
    await getStatusWithRetry(t, e, n);
  } catch (r) {
    console.error("ErrorError:", r);
  }
}
async function getStatusWithRetry(e, t, n) {
  const l = localStorage.getItem("token");
  const o = JSON.stringify({
      tenant_id: "4629a7153b7942609b27af9417648479",
      ...(t && { event_id: t }),
      ...(l && { vwr_token: n ? n : l }),
    }),
    a = window.location.href;
  try {
    const r = await fetch(e, {
      method: "POST",
      body: o,
      headers: { "Content-Type": "application/json", Origin: a },
      credentials: "include",
      cache: "no-store",
    });
    if (200 === r.status) {
      localStorage.removeItem("token");
      const e = await r.json(),
        n = e.route,
        o = window.location.pathname;
      switch (n) {
        case 0:
          window.location.href =
            "https://hitenant.vwr-exv.click/waiting-room-site/prewaitingroom?event_id=" +
            t +
            "&tenant_id=4629a7153b7942609b27af9417648479&path=" +
            o +
            "&token=" +
            n +
            "&event_name=" +
            e.event_name;
          break;
        case 1:
          window.location.href =
            "https://hitenant.vwr-exv.click/waiting-room-site/waitingroom?event_id=" +
            t +
            "&tenant_id=4629a7153b7942609b27af9417648479&path=" +
            o +
            "&token=" +
            n +
            "&event_name=" +
            e.event_name;
          break;
        case 2:
          const a = document.getElementById("loading_waiting");
          a.classList.remove("open_modal"),
            a.classList.add("hide_modal"),
            document.body.classList.add("hide_loading"),
            getForm();
      }
      return !0;
    }
    if (429 === r.status)
      console.warn("Received 429 Too Many Requests - Retrying attempt ");
    else throw new Error("HTTP error! Status: error");
  } catch (i) {
    console.error("Attempt  failed: " + i.message);
    if (attempt === retries) throw i;
  }
}
function getForm() {
  document.querySelectorAll("form").forEach((e) => {
    e.addEventListener("submit", async function (t) {
      t.preventDefault(), await trackFormSubmission();
    });
  });
}
async function trackFormSubmission() {
  try {
    if (!localStorage.getItem("hasSubmitted")) {
      const e = window.location.href,
        t = JSON.stringify({
          tenant_id: "4629a7153b7942609b27af9417648479",
          event_id: sessionStorage.getItem("event_id"),
        }),
        n = await fetch("https://hitenant-api.vwr-exv.click/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: e },
          body: t,
          credentials: "include",
          cache: "no-store",
        });
      if (!n.ok) throw new Error("Tracking API call failed");
      return localStorage.setItem("hasSubmitted", "true"), !0;
    }
  } catch (r) {
    return console.error("Error tracking form submission:", r), !1;
  }
}
window.onload = function () {
  localStorage.removeItem("hasSubmitted");
};
function initializeWaiting() {
  const u = navigator.userAgent;
  const e = window.location.href,
    t = "https://hitenant-api.vwr-exv.click/trigger_checking",
    n = JSON.stringify({
      tenant_id: "4629a7153b7942609b27af9417648479",
      url: e,
      headers: { UserAgent: u },
    });
  fetch(t, { method: "POST", body: n })
    .then((e) => {
      if (!e.ok) throw new Error("Network response was not ok");
      return e.json();
    })
    .then((e) => {
      "Success" == e.message && sessionStorage.setItem("event_id", e?.event_id),
        "Success" == e.message && "queue" == e.action
          ? routeTarget(e?.event_id)
          : "Success" == e.message && "checkout" == e.action
          ? trackFormSubmission()
          : (document
              .getElementById("loading_waiting")
              .classList.remove("open_modal"),
            document
              .getElementById("loading_waiting")
              .classList.add("hide_modal"));
    })
    .catch((e) => {
      console.error("Error:", e);
    });
}
console.log("Waiting room script loaded");
// document.addEventListener("DOMContentLoaded", () => {
window.initializeWaiting();
// });
