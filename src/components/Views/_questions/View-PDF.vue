<template>
  <div class="pdf-viewer-container">
    <canvas ref="canvasRef"></canvas>
    <div class="pdf-controls">
      <button :disabled="pageNum <= 1" @click="prevPage">上一页</button>
      <span>第 {{ pageNum }} / {{ pageCount }} 页</span>
      <button :disabled="pageNum >= pageCount" @click="nextPage">下一页</button>
      <button :disabled="scale <= 0.5" @click="zoomOut">缩小</button>
      <span>{{ (scale * 100).toFixed(0) }}%</span>
      <button :disabled="scale >= 3" @click="zoomIn">放大</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import "pdfjs-dist/web/pdf_viewer.css";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const props = defineProps<{ src: string }>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const pageNum = ref(1);
const pageCount = ref(1);
const scale = ref(1.5);
let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;

const renderPage = async (num: number) => {
  if (!pdfDoc || !canvasRef.value) return;
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: scale.value });
  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  if (!context) return;
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext).promise;
};

const loadPdf = async (url: string) => {
  pdfDoc = await pdfjsLib.getDocument(url).promise;
  pageCount.value = pdfDoc.numPages;
  pageNum.value = 1;
  await renderPage(pageNum.value);
};

const prevPage = async () => {
  if (pageNum.value <= 1) return;
  pageNum.value--;
  await renderPage(pageNum.value);
};

const nextPage = async () => {
  if (!pdfDoc || pageNum.value >= pdfDoc.numPages) return;
  pageNum.value++;
  await renderPage(pageNum.value);
};

const zoomIn = async () => {
  if (scale.value < 3) {
    scale.value += 0.2;
    await renderPage(pageNum.value);
  }
};

const zoomOut = async () => {
  if (scale.value > 0.5) {
    scale.value -= 0.2;
    await renderPage(pageNum.value);
  }
};

watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) loadPdf(newSrc);
  },
  { immediate: true },
);

onMounted(() => {
  if (props.src) loadPdf(props.src);
});
</script>

<style scoped>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
}
canvas {
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 12px;
  max-width: 100%;
}
.pdf-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}
button {
  padding: 4px 12px;
  border: none;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
