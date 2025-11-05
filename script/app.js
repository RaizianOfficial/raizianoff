const navOpen = document.querySelector("#navOpen");
const hddNav = document.querySelector(".hdd-nav");

let isNavOpen = false;

navOpen.addEventListener("click", () => {
    if (isNavOpen) {
        // Add hide animation
        hddNav.classList.remove("animate-fade-in");
        hddNav.classList.add("animate-fade-out");

        // Wait for animation to complete then hide
        setTimeout(() => {
            hddNav.style.display = "none";
        }, 300); // Match with your animation duration
    } else {
        // Show and add show animation
        hddNav.style.display = "block";
        hddNav.classList.remove("animate-fade-out");
        hddNav.classList.add("animate-fade-in");
    }

    isNavOpen = !isNavOpen;
});


document.getElementById("raizianBtn").addEventListener("click", function() {
    window.location.href = "main.html";
  });

  
