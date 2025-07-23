console.log(import.meta.env, "env");
const { VITE_Md, VITE_Python, VITE_Typora, VITE_Yuque } = import.meta.env;
console.log(VITE_Typora, VITE_Yuque, VITE_Python, VITE_Md);

const yuque = VITE_Yuque;
const typora = VITE_Typora;
const md = VITE_Md;
const python = VITE_Python;
export function urlMd() {
  const python_url = md + python;

  return {
    Python: {
      yuque: python_url + yuque,
      typora: python_url + typora,
    },
  };
}
