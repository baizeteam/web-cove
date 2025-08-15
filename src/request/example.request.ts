import request from "@/utils/request.util";
import axios from "axios";

// 方案1：服务端/Node环境，axios自定义headers模拟浏览器
export async function getExampleDataWithHeaders<T = any>(): Promise<T> {
  const res = await axios.get<T>(
    "https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ABmOoWbg4gMKAOaw/img/9a2c5f84-21a8-4527-8834-5ba473a65511.png",
    {
      headers: {
        Referer: "https://alidocs.aliyun.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer", // 如需图片二进制
    }
  );
  return res.data as T;
}

// 方案2：浏览器端 axios 请求（会受CORS限制，无法自定义Referer）
export async function getExampleDataBrowser<T = any>(): Promise<T> {
  // 直接用 request 封装（即 axios 实例）
  // 如果目标服务器未设置 CORS，浏览器会拦截
  const res = await request.get<T>(
    "https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/ABmOoWbg4gMKAOaw/img/9a2c5f84-21a8-4527-8834-5ba473a65511.png"
  );
  return res as T;
}

// 示例：POST 请求
export async function postExampleData<T = any, D = any>(data: D): Promise<T> {
  const res = await request.post<T>("/example", data);
  return res as T;
}

// 示例：PUT 请求
export async function putExampleData<T = any, D = any>(data: D): Promise<T> {
  const res = await request.put<T>("/example", data);
  return res as T;
}

// 示例：DELETE 请求
export async function deleteExampleData<T = any>(
  id: string | number
): Promise<T> {
  const res = await request.delete<T>(`/example/${id}`);
  return res as T;
}
