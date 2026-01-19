// ==UserScript==
// @name         Firefox Month input Calendar
// @namespace    https://github.com/hirohiro716/
// @version      1.0
// @description  Add a calendar to FireFox's month input.
// @author       hiro
// @match        https://*/*
// @icon         https://www.firefox.com/favicon.ico
// @grant        none
// @updateURL    https://github.com/hirohiro716/firefox-month-input-calendar/raw/main/firefox-month-input-calendar.user.js
// @downloadURL  https://github.com/hirohiro716/firefox-month-input-calendar/raw/main/firefox-month-input-calendar.user.js
// ==/UserScript==

const popupID = "hirohiro716-firefox-month-input-calendar-popup";
const clearButtonID = "hirohiro716-firefox-month-input-calendar-clear-button";
const yearParagraphClassName = popupID + "-year";
const monthParagraphClassName = popupID + "-month";
window.addEventListener("scroll", () => {
    const popup = window.document.querySelector("div#" + popupID);
    if (popup) {
        popup.remove();
    }
    const clearButton = window.document.querySelector("div#" + clearButtonID);
    if (clearButton) {
        clearButton.remove();
    }
});
const addEventHandler = function() {
    const inputs = window.document.querySelectorAll('input[type="month"]');
    for (const input of inputs) {
        if (input.getAttribute(popupID) !== null) {
            continue;
        }
        const inputComputedStyle = window.getComputedStyle(input);
        const clearButton = window.document.createElement("div");
        clearButton.textContent = "×";
        clearButton.setAttribute("id", clearButtonID);
        clearButton.style.position = "fixed";
        clearButton.style.height = inputComputedStyle.getPropertyValue("height");
        clearButton.style.zIndex = "calc(infinity)";
        clearButton.style.margin = "0";
        clearButton.style.padding = "0";
        clearButton.style.backgroundColor = "rgba(0,0,0,0)";
        clearButton.style.display = "flex";
        clearButton.style.alignItems = "center";
        clearButton.style.fontSize = inputComputedStyle.getPropertyValue("font-size");
        clearButton.style.cursor = "pointer";
        const clearButtonOpacity = "0.5";
        clearButton.style.opacity = clearButtonOpacity;
        clearButton.addEventListener("mouseover", () => {
            clearButton.style.opacity = "1";
        });
        clearButton.addEventListener("mouseout", () => {
            clearButton.style.opacity = clearButtonOpacity;
        });
        clearButton.addEventListener("mousedown", (event) => {
            event.preventDefault();
            input.value = "";
            updateCurrentSelection();
        });
        const appendClearButton = () => {
            const domRect = input.getBoundingClientRect();
            clearButton.style.top = parseInt(domRect.y) + "px";
            if (inputComputedStyle.getPropertyValue("text-align") !== "right") {
                clearButton.style.left = "calc(" + parseInt(domRect.x + domRect.width) + "px - 1em)";
            } else {
                clearButton.style.left = "calc(" + parseInt(domRect.x) + "px + 0.5em)";
            }
            window.document.body.append(clearButton);
        }
        const popup = window.document.createElement("div");
        popup.setAttribute("id", popupID);
        popup.style.position = "fixed";
        popup.style.zIndex = "calc(infinity)";
        popup.style.margin = "0";
        popup.style.padding = "0.5em";
        popup.style.border = "1px solid #ccc";
        popup.style.borderRadius = "0.3em";
        popup.style.backgroundColor = "#fff";
        popup.style.boxShadow = "0.2em 0 0.5em 0 rgba(0, 0, 0, 0.2)";
        popup.style.display = "flex";
        popup.style.flexDirection = "row";
        popup.style.gap = "0.5em";
        popup.style.fontSize = inputComputedStyle.getPropertyValue("font-size");
        popup.addEventListener("mousedown", (event) => {
            event.preventDefault();
        });
        const getYearAndMonth = () => {
            const parts = input.value.split(/[^0-9]/);
            const yearAndMonth = [];
            const year = parseInt(parts[0]);
            yearAndMonth.push(year);
            if (parts.length > 1) {
                yearAndMonth.push(parseInt(parts[1]));
            }
            return yearAndMonth;
        }
        const currentYear = (new Date()).getFullYear();
        const currentMonth = (new Date()).getMonth() + 1;
        const updateCurrentSelection = () => {
            for (const p of popup.querySelectorAll("p")) {
                p.style.backgroundColor = "";
            }
            const inputYearAndMonth = getYearAndMonth();
            const inputYear = isNaN(inputYearAndMonth[0]) === false ? inputYearAndMonth[0] : currentYear;
            const currentYearElement = popup.querySelector('p[data-year="' + inputYear + '"]');
            if (currentYearElement !== null) {
                currentYearElement.style.backgroundColor = "#efefef";
            }
            const inputMonth = isNaN(inputYearAndMonth[1]) === false ? inputYearAndMonth[1] : currentMonth;
            const currentMonthElement = popup.querySelector('p[data-month="' + inputMonth + '"]');
            if (currentMonthElement !== null) {
                currentMonthElement.style.backgroundColor = "#efefef";
            }
        }
        const setYearAndMonth = (newYear, newMonth) => {
            const yearAndMonth = input.value.split(/[^0-9]/);
            let year = undefined;
            year = newYear ? newYear : yearAndMonth[0];
            let month = undefined;
            if (yearAndMonth.length > 1) {
                month = yearAndMonth[1];
            }
            if (newMonth) {
                month = newMonth;
            }
            let value = year;
            value += "-";
            if (month && isNaN(month) === false) {
                value += String(month).padStart(2, '0');
            }
            input.value = value;
            updateCurrentSelection();
        }
        const scrollToCurrentSelection = () => {
            const inputYearAndMonth = getYearAndMonth();
            const inputYear = isNaN(inputYearAndMonth[0]) === false ? inputYearAndMonth[0] : currentYear;
            const currentYearElement = popup.querySelector('p[data-year="' + inputYear + '"]');
            if (currentYearElement !== null) {
                currentYearElement.scrollIntoView();
            }
            const inputMonth = isNaN(inputYearAndMonth[1]) === false ? inputYearAndMonth[1] : currentMonth;
            const currentMonthElement = popup.querySelector('p[data-month="' + inputMonth + '"]');
            if (currentMonthElement !== null) {
                currentMonthElement.scrollIntoView();
            }
        }
        const yearsDiv = window.document.createElement("div");
        yearsDiv.style.maxHeight = "16em";
        yearsDiv.style.margin = "0";
        yearsDiv.style.padding = "0 0.5em 0 0";
        yearsDiv.style.display = "flex";
        yearsDiv.style.flexDirection = "column";
        yearsDiv.style.gap = "0.8em";
        yearsDiv.style.overflow = "scroll";
        yearsDiv.style.fontSize = "inherit";
        popup.append(yearsDiv);
        const updateYears = () => {
            for (const p of popup.querySelectorAll("p." + yearParagraphClassName)) {
                p.remove();
            }
            const inputYearAndMonth = getYearAndMonth();
            const inputYear = isNaN(inputYearAndMonth[0]) === false ? inputYearAndMonth[0] : currentYear;
            for (let year = inputYear - 10; year <= inputYear + 10; year++) {
                const p = window.document.createElement("p");
                p.textContent = year + "年";
                p.className = yearParagraphClassName;
                p.style.width = "100%";
                p.style.margin = "0";
                p.style.padding = "0";
                p.style.lineHeight = "1em";
                p.style.fontSize = "inherit";
                p.style.cursor = "pointer";
                p.setAttribute("data-year", year);
                p.addEventListener("mousedown", (event) => {
                    event.preventDefault()
                    setYearAndMonth(year, null);
                });
                p.addEventListener("mouseover", () => {
                    p.style.opacity = "0.7";
                });
                p.addEventListener("mouseout", () => {
                    p.style.opacity = "1";
                });
                yearsDiv.append(p);
            }
        }
        const monthsDiv = window.document.createElement("div");
        monthsDiv.style.maxHeight = "16em";
        monthsDiv.style.paddingRight = "0.5em";
        monthsDiv.style.display = "flex";
        monthsDiv.style.flexDirection = "column";
        monthsDiv.style.gap = "0.8em";
        monthsDiv.style.overflow = "scroll";
        monthsDiv.style.fontSize = "inherit";
        popup.append(monthsDiv);
        for (let month = 1; month <= 12; month++) {
            const p = window.document.createElement("p");
            p.textContent = month + "月";
            p.className = monthParagraphClassName;
            p.style.width = "100%";
            p.style.margin = "0";
            p.style.padding = "0";
            p.style.lineHeight = "1em";
            p.style.textAlign = "right";
            p.style.fontSize = "inherit";
            p.style.cursor = "pointer";
            p.setAttribute("data-month", month);
            p.addEventListener("mousedown", (event) => {
                event.preventDefault()
                setYearAndMonth(null, month);
            });
            p.addEventListener("mouseover", () => {
                p.style.opacity = "0.7";
            });
            p.addEventListener("mouseout", () => {
                p.style.opacity = "1";
            });
            monthsDiv.append(p);
        }
        const appendPopup = () => {
            const domRect = input.getBoundingClientRect();
            if (domRect.top < window.visualViewport.height / 2) {
                popup.style.top = "calc(" + parseInt(domRect.y + domRect.height) + "px + 0.3em)";
            } else {
                popup.style.top = "calc(" + parseInt(domRect.y) + "px - 17em - 0.3em)";
            }
            popup.style.left = domRect.x + "px";
            updateYears();
            window.document.body.append(popup);
            updateCurrentSelection();
            scrollToCurrentSelection();
        }
        input.addEventListener("click", () => {
            const popupElement = window.document.querySelector("div#" + popupID);
            if (popupElement === null) {
                appendPopup();
            } else {
                popupElement.remove();
            }
            const clearButtonElement = window.document.querySelector("div#" + clearButtonID);
            if (clearButtonElement === null) {
                appendClearButton();
            }
        });
        input.addEventListener("focus", () => {
            const clearButtonElement = window.document.querySelector("div#" + clearButtonID);
            if (clearButtonElement === null) {
                appendClearButton();
            }
        });
        input.addEventListener("blur", () => {
            popup.remove();
            clearButton.remove();
        });
        input.addEventListener("input", () => {
            updateCurrentSelection();
            scrollToCurrentSelection();
        });
        input.addEventListener("keydown", (event) => {
            const inputYearAndMonth = getYearAndMonth();
            const inputYear = isNaN(inputYearAndMonth[0]) === false ? inputYearAndMonth[0] : currentYear;
            const inputMonth = isNaN(inputYearAndMonth[1]) === false ? inputYearAndMonth[1] : currentMonth;
            switch (event.key) {
                case "Enter":
                case "Escape":
                    popup.remove();
                    break;
                case "ArrowUp":
                    if (inputMonth > 1) {
                        setYearAndMonth(inputYear, inputMonth - 1);
                    } else {
                        setYearAndMonth(inputYear - 1, 12);
                    }
                    scrollToCurrentSelection();
                    break;
                case "ArrowDown":
                    if (inputMonth < 12) {
                        setYearAndMonth(inputYear, inputMonth + 1);
                    } else {
                        setYearAndMonth(inputYear + 1, 1);
                    }
                    scrollToCurrentSelection();
                    break;
            }
        });
        input.setAttribute(popupID, popupID);
    }
};
setInterval(addEventHandler, 1000);
