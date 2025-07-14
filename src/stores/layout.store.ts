import { defineStore } from "pinia";

interface LayoutComponent {
  height: string;
  backgroundColor?: string;
  [key: string]: any; // Allow for additional properties
}

interface LayoutState {
  header: LayoutComponent;
  footer: LayoutComponent;
  fixedBottom: LayoutComponent;
}

export const useLayoutStore = defineStore("layout", {
  state: (): LayoutState => {
    const header: LayoutComponent = {
      height: "44px",
      backgroundColor: "#f5f5f5",
    };
    const footer: LayoutComponent = {
      height: "55px",
    };
    const fixedBottom: LayoutComponent = {
      height: "106px",
      paddingTop: "50px",
    };
    return {
      header,
      footer,
      fixedBottom,
    };
  },
  actions: {
    async setLayout(p: keyof LayoutState, options: Partial<LayoutComponent>) {
      if (this[p] && typeof this[p] === "object") {
        for (const key in options) {
          if (this[p][key] !== undefined) {
            (this[p] as Record<string, any>)[key] = options[key];
          }
        }
      }
    },
  },
});
