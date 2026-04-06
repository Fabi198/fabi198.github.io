<script>
  function copyEmail() {
    const email = "fabianferrer42@gmail.com";
    navigator.clipboard.writeText(email);

    const snackbar = document.getElementById("snackbar");
    snackbar.classList.add("show");

    setTimeout(() => {
      snackbar.classList.remove("show");
    }, 2000);
  }

  function showEmail() {
    document.getElementById("emailBox").style.opacity = "1";
  }

  function hideEmail() {
    document.getElementById("emailBox").style.opacity = "0";
  }
</script>
