const deactivationModal = document.getElementById("deactivationModal");

async function handleLogout() {
  await fetch("/api/users/signout", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  window.location.replace("/");
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
