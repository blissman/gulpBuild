const getText = (textboxId) => {
    const text = document.getElementById(textboxId).value;
    showToast(text);
};

const setListener = (buttonId, textboxId) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
        getText(textboxId);
    });
};

const showToast = (value) => {
    const toastDiv = document.getElementById("toast");
    const alert = document.createElement("div");
    const removeButton = document.createElement("button");
    removeButton.innerText = "X";
    removeButton.addEventListener("click", () => {
        dismissToast(alert);
    });
    alert.innerText = value;
    toastDiv.appendChild(alert);
    alert.appendChild(removeButton);
}

const dismissToast = (element) => {
    element.parentNode.removeChild(element);
}

setListener("trigger", "textbox");