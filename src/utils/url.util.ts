console.log(import.meta.env, "env");
const { VITE_Md, VITE_Python } = import.meta.env;
console.log(VITE_Python, VITE_Md);

const md = VITE_Md;
const python = VITE_Python;
export function urlMd() {
  const python_url = md + python;

  return {
    Python: python_url,
  };
}
