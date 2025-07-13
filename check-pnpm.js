if (!process.env.npm_execpath || !process.env.npm_execpath.includes('pnpm')) {
  console.error('请使用 pnpm 安装依赖！');
  process.exit(1);
}
