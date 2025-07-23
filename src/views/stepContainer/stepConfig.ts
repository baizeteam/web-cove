import { urlMd } from "@/utils/url.util.ts";

interface MdStep {
  type: "md";
  src: string;
}

export interface ChoiceStep<Options extends readonly string[]> {
  type: "choice";
  data: {
    questions: string;
    code?: string;
    options: Options;
    answer: Options[number]; // `Options[number]` 提取联合类型
  };
}

// `StepConfig` 需要动态处理 `ChoiceStep` 的泛型
type StepConfig = MdStep | ChoiceStep<readonly string[]>; // 默认泛型

type StepConfigRouter = {
  [key: number]: StepConfig;
};

// 定义一个辅助函数，自动推断 options 类型
const createChoiceStep = <Options extends readonly string[]>(
  step: ChoiceStep<Options>,
) => step;

export const stepConfigRouter = {
  1: {
    type: "md",
    src: urlMd().Python.yuque + "/001-Python特点.md?raw",
  },
  2: createChoiceStep({
    type: "choice",
    data: {
      questions: "以下的代码运行什么？",
      code: `
             def print_double(x):
               print(2 * x)
             print_double(3)
            `,
      options: ["A.6", "B.2", "C.3", "D.0"] as const,
      answer: "A.6", // 使用辅助函数创建，这里会正确报错
    },
  }),
  3: {
    type: "md",
    src: urlMd().Python.yuque + "/thrid.md",
  },
} as const satisfies StepConfigRouter; // `satisfies` 确保类型匹配但不放宽类型
