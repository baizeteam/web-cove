/* shims-vue.d.ts */
// 该文件在 src 目录下才管用
// 只保留推荐的 .vue 文件类型声明，避免类型冲突

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 支持TS识别CSS/SCSS模块
declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

// 支持TS识别静态资源
declare module '*.png' {
    const src: string
    export default src
}
declare module '*.jpg' {
    const src: string
    export default src
}
declare module '*.jpeg' {
    const src: string
    export default src
}
declare module '*.gif' {
    const src: string
    export default src
}
declare module '*.svg' {
    const src: string
    export default src
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}
declare module '*.webp' {
    const src: string
    export default src
}

// 支持TS识别Markdown文件（根据需求添加）
declare module '*.md' {
    const content: string
    export default content
}
