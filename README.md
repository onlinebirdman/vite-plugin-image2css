# vite-plugin-image2css

## Installation

```bash
pnpm add -D vite-plugin-image2css
```

## Usage

```typescript
// vite.config.ts
import image2css from './vite-plugin-image2css'
export default defineConfig({
  plugins: [
    image2css({
      dir: './src/assets/imgs' // watching dir
    }),
  ]
});
```

```typescript
// main.ts
import 'virtual:image2css'
```
./src/assets/imgs
```
a.png => img-a
a.jpg => img-a~jpg

b.jpg => img-b
c.png => img-c
/dir/a.png => img-dir-a
/dir/c.png => img-dir-c
```

## 文件夹嵌套
img-dir1-dir2

## 图片格式(暂不支持同名不同后缀)
img-dir1-dir2-filename