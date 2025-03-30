const toastBody = document.getElementById("toastBody");
const toastBtn = document.getElementById("liveToastBtn");
const toastWrapper = document.getElementById("liveToast");
const deactivationModal = document.getElementById("deactivationModal");

async function handleLogout() {
  try {
    await axios.post("/api/users/signout", {}, { withCredentials: true });
    showToast("User logged out successfully...", true);
    setTimeout(() => window.location.replace("/"), 1500);
  } catch (error) {
    showToast(error?.response?.data?.error || "Unexpected error occured");
  }
}

function showToast(message, isSuccess = false) {
  if (isSuccess) {
    toastWrapper.classList.remove("text-bg-danger");
    toastWrapper.classList.add("text-bg-success");
  } else toastWrapper.classList.add("text-bg-danger");
  toastBody.textContent = message;
  toastBtn.click();
}

document.getElementById("deactivateForm").addEventListener("submit", async function (event) {
  const alertEl = document.getElementById("deactivateAccountAlert");
  event.preventDefault();

  const formData = new FormData(this);
  const password = formData.get("password");

  try {
    await axios.post("/api/users/deactivate", { password });
    alertEl.classList.remove("d-none", "alert-danger");
    alertEl.classList.add("alert-success");
    alertEl.textContent = "Account deactivated successfully";
    setTimeout(() => location.reload(), 2000);
  } catch (error) {
    alertEl.classList.remove("d-none");
    alertEl.textContent = error?.response?.data?.error;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  ScrollReveal().reveal(".reveal-item", {
    delay: 200,
    duration: 800,
    distance: "50px",
    origin: "bottom",
    easing: "ease-in-out",
    interval: 200,
  });
});

document.addEventListener("DOMContentLoaded", function () {
  ScrollReveal().reveal(".reveal-banner", {
    duration: 1000,
    scale: 0.5,
    easing: "ease-in-out",
    distance: "0px",
  });
});

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}
