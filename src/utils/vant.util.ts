import { showConfirmDialog } from "vant";

interface IConfirmOptions {
  title?: string;
  message?: string;
  width?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  showCancelButton?: boolean;
  closeOnPopstate?: boolean;
  confirm?: () => void;
  cancel?: () => void;
}

export function vantConfirm(options: IConfirmOptions) {
  const delay = 500;
  const defaultConfirmOptions: IConfirmOptions = Object.freeze({
    title: "提示",
    message: "该操作不可回退，确认继续？",
    // theme: 'round-button', // 可选值：'round-button'
    width: "320px", // 弹窗宽度
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    confirmButtonColor: "#333",
    cancelButtonColor: "#333",
    showCancelButton: true, // 是否显示取消按钮
    closeOnPopstate: true, // 是否在页面回退时关闭
    confirm: () => undefined,
    cancel: () => undefined,
  });
  showConfirmDialog({
    ...defaultConfirmOptions,
    ...options,
  })
    .then(() => {
      setTimeout(() => options.confirm, delay);
    })
    .catch(() => {
      setTimeout(() => options.cancel, delay);
    });
}
