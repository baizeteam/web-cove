const stepConfigRouter = {
  "1": { type: "md", src: "@/assets/_markdown/yuque_origin.md?raw" },
  "2": {
    type: "choice",
    data: {
      questions: "",
      options: ["A.6", "B.2", "C.3", "D.0"],
      answers: ["A.6"],
    },
  },
  "3": { type: "md", src: "/md/third.md" },
};

export default stepConfigRouter;
