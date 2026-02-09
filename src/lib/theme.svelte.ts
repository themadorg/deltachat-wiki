import { browser } from "$app/environment";

interface ThemeState {
    current: "light" | "dark";
}

let _theme = $state<ThemeState>({
    current: "dark"
});

export const theme = {
    get current() { return _theme.current; },
    set current(v) { _theme.current = v; },

    toggle() {
        this.current = this.current === "dark" ? "light" : "dark";
        if (browser) {
            localStorage.setItem("theme", this.current);
            document.documentElement.setAttribute("data-theme", this.current);
        }
    },

    init() {
        if (browser) {
            const saved = localStorage.getItem("theme") as "light" | "dark";
            if (saved === "light" || saved === "dark") {
                this.current = saved;
            } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                this.current = "light";
            }
            document.documentElement.setAttribute("data-theme", this.current);
        }
    }
};
