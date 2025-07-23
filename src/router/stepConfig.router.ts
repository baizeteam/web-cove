import { urlMd } from "@/utils/url.util.ts";

const stepConfigRouter = {
  "1": {
    type: "md",
    src: urlMd().Python.yuque + "/transform_typora.md",
  },
  "2": {
    type: "choice",
    data: {
      questions: "",
      options: ["A.6", "B.2", "C.3", "D.0"],
      answers: ["A.6"],
    },
  },
  "3": {
    type: "md",
    src: urlMd().Python.yuque + "/thrid.md",
  },
};

export default stepConfigRouter;
