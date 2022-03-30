

// When the user clicks anywhere outside of the modal, close it and clear text
// When the user clicks on <span> (x), close the modal and clear text
export function bindExitModalListeners () {
    let gameMessageWindow = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    window.onclick = function (event) {
        if (event.target === gameMessageWindow) {
            document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
            gameMessageWindow.style.display = "none";
        }
    };
    span.onclick = function () {
        document.getElementById("modal-text-wrapper").innerHTML = `<p id="modal-text"></p>`;
        gameMessageWindow.style.display = "none";
    };
    return [gameMessageWindow, span];
}