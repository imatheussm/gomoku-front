if (window.matchMedia("(prefers-color-scheme: dark)").media === "not all") {
    document.documentElement.style.display = "none";
    document.head.insertAdjacentHTML(
        "beforeend",
        "<link id=\"css\" rel=\"stylesheet\" href=\"../assets/css/bootstrap-5.1.1.min.css\" " +
        "onload=\"document.documentElement.style.display = ''\">"
    );
}