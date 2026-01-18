// ==UserScript==
// @name         Firefox Month input Calendar
// @namespace    https://github.com/hirohiro716/
// @version      1.0
// @description  Add a calendar to FireFox's month input.
// @author       hiro
// @match        https://*/*
// @icon         https://www.firefox.com/favicon.ico
// @grant        none
// @updateURL    https://github.com/hirohiro716/line-chat-style/raw/main/firefox-month-input-calendar.user.js
// @downloadURL  https://github.com/hirohiro716/line-chat-style/raw/main/firefox-month-input-calendar.user.js
// ==/UserScript==

const identifierName = "firefox-month-input-calendar";
window.addEventListener("scroll", () => {
    const popup = window.document.querySelector('div[data-id="' + identifierName + '"]');
    if (popup) {
        popup.remove();
    }
});
const addEventHandler = function() {
    const inputs = window.document.querySelectorAll('input[type="month"]');
    for (const input of inputs) {
        if (input.getAttribute(identifierName) !== null) {
            continue;
        }
        const popup = window.document.createElement("div");
        popup.setAttribute("data-id", identifierName);
        popup.style.position = "fixed";
        popup.style.margin = "0";
        popup.style.padding = "0.5em";
        popup.style.border = "1px solid #ccc";
        popup.style.borderRadius = "0.3em";
        popup.style.backgroundColor = "#fff";
        popup.style.boxShadow = "0.2em 0 0.5em 0 rgba(0, 0, 0, 0.2)";
        popup.style.border = "1px solid #ccc";
        popup.style.display = "flex";
        popup.style.flexDirection = "row";
        popup.style.gap = "0.5em";
        popup.style.fontSize = window.getComputedStyle(input).getPropertyValue("font-size");
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
        }
        const currentYear = (new Date()).getFullYear();
        const currentMonth = (new Date()).getMonth() + 1;
        const updateCurrentSelection = () => {
            for (const p of popup.querySelectorAll("p")) {
                p.style.backgroundColor = "";
            }
            const yearAndMonth = getYearAndMonth();
            let currentYearElement = popup.querySelector('p[data-year="' + yearAndMonth[0] + '"]');
            if (currentYearElement === null) {
                currentYearElement = popup.querySelector('p[data-year="' + currentYear + '"]');
            }
            currentYearElement.style.backgroundColor = "#efefef";
            currentYearElement.scrollIntoView();
            let currentMonthElement = popup.querySelector('p[data-month="' + yearAndMonth[1] + '"]');
            if (currentMonthElement === null) {
                currentMonthElement = popup.querySelector('p[data-month="' + currentMonth + '"]');
            }
            currentMonthElement.style.backgroundColor = "#efefef";
            currentMonthElement.scrollIntoView();
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
        for (let year = currentYear - 10; year <= currentYear + 10; year++) {
            const p = window.document.createElement("p");
            p.textContent = year + "年";
            p.style.width = "100%";
            p.style.margin = "0";
            p.style.padding = "0";
            p.style.lineHeight = "1em";
            p.style.fontSize = "inherit";
            p.style.cursor = "pointer";
            p.setAttribute("data-year", year);
            p.addEventListener("mousedown", () => {
                setTimeout(() => {
                    input.focus();
                    setYearAndMonth(year, null);
                    updateCurrentSelection();
                }, 100);
            });
            p.addEventListener("mouseover", () => {
                p.style.opacity = "0.7";
            });
            p.addEventListener("mouseout", () => {
                p.style.opacity = "1";
            });
            yearsDiv.append(p);
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
            p.style.width = "100%";
            p.style.margin = "0";
            p.style.padding = "0";
            p.style.lineHeight = "1em";
            p.style.textAlign = "right";
            p.style.fontSize = "inherit";
            p.style.cursor = "pointer";
            p.setAttribute("data-month", month);
            p.addEventListener("mousedown", () => {
                setTimeout(() => {
                    input.focus();
                    setYearAndMonth(null, month);
                    updateCurrentSelection();
                }, 100);
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
            window.document.body.append(popup);
            updateCurrentSelection();
        }
        input.addEventListener("focus", () => {
            appendPopup();
        });
        input.addEventListener("click", () => {
            if (window.document.querySelector('div[data-id="' + identifierName + '"]') === null) {
                appendPopup();
            }
        });
        input.addEventListener("blur", () => {
            popup.remove();
        });
        input.setAttribute(identifierName, identifierName);
    }
};
setInterval(addEventHandler, 1000);
