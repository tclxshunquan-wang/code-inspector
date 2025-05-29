<h1 align="center">Hyperse Code Inspector</h1>

## Introduction

**@hyperse/inspector** is the tool for seamlessly code navigation from browser to IDE.

With **just a simple click**, you can jump from a React component on the browser to its source code in your local IDE instantly.
Think of it as a more advanced version of Chrome's Inspector.

#### Why @hyperse/inspector

Have you ever run into any of these issues 🤔:

- You've got to fix some bugs in your team's project, but you have no idea where the heck page/component's code is located.
- You're eager to dive into an open-source project that interests you, but it's hard to find where the code for the page/component is implemented.
- You may thinking about a component and want to quickly peek at its code, but don't want to memorize or manually expand those never-ending deep file paths.
- Support for multiple frameworks, such as Vite, Webpack, Rspack, etc.
- Support for native swc-loader plugin
- Support for react 19

That's exactly why @hyperse/inspector was created.

### Default Hotkeys

- macOS: `⌘ + i`
- Windows/Linux: `Ctrl + i`
- You can customize the hotkeys by passing the `keys` prop to the `<Inspector/>` component.

<br>

### Quick Look

> screen record:

<video alt="inspector-preview" src="https://github.com/hyperse-io/code-inspector/tree/main/public/quick-look.mp4" loop autoplay muted></video>

## How to Use and Configure

According to the working pipeline [below](#how-it-works), the **Part.1** and **Part.2** are what you need configure to use.

Basically, it's includes:

1. add the `<Inspector/>` component in your page

   ```tsx
   import { Inspector } from '@hyperse/inspector';

   export default function App() {
     const [active, setActive] = useState(false);
     return (
       <div>
         <Inspector
           keys={['Shift', 'c']}
           active={active}
           onActiveChange={setActive}
         />
         {/* other components */}
       </div>
     );
   }
   ```

2. add the `@hyperse/inspector-middleware` in your dev-server

   ```tsx
   import { createInspectorMiddleware } from '@hyperse/inspector-middleware';
   const config = {
     context: process.cwd(),
     mode: isDev ? 'development' : 'production',
     devServer: {
       setupMiddlewares(middlewares) {
         /**
          * @hyperse/inspector server config for webpack or other frameworks
          */
         middlewares.unshift(createLaunchEditorMiddleware({}));
         return middlewares;
       },
     },

     ...other config
   };
   ```

3. add the `@hyperse/inspector-babel-plugin` in your babel config or swc-loader config

   ```tsx
   import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';

   // for babel-loader config
   const config = {
     module: {
       rules: [
         ...other rules,
         {
           test: /\.(js|jsx|ts|tsx)$/,
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader',
             options: {
               presets: [
                 ['@babel/preset-env', { targets: 'defaults' }],
                 '@babel/preset-typescript',
                 [
                   '@babel/preset-react',
                   {
                     runtime: 'automatic',
                   },
                 ],
               ],
               plugins: ['@hyperse/inspector-babel-plugin'],
             },
           },
         },
       ],
     },
   };

   // for swc-loader config

   const config = {
   module: {
    rules: [
      ...other rules,
      {
        test: /\.tsx?$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            experimental: {
              plugins: [['@hyperse/inspector-swc-plugin', {}]],
            },
            ...other options,
          },
        },
      },
    ],
   },
   };

   ```

## How It Works

Here is the working pipeline of `@hyperse/inspector`:

![Working Pipeline](https://github.com/hyperse-io/code-inspector/tree/main/public/working-pipeline.svg)
<br/>

> **Note:** The **0** of _Part.0_ implies that this section is generally **OPTIONAL**.
> Most React frameworks offer this feature **_out-of-the-box_**,
> which means you usually **don't** need to manually configure it additionally.

### 1. Inspector Component

The @hyperse/inspector provide a `<Inspector/>` component to reads the source info,
and sends it to the dev-server when you inspect elements on browser.

### 2. Dev Server Middleware

The @hyperse/inspector-middleware provide some middlewares for dev-server in most frameworks to receives source path info from API,
then call your local IDE/Editor to open the source file.

---

## License

[MIT LICENSE](./LICENSE)
