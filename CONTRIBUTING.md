## 如何新增对一个组件的支持

比如你想新增对`Notification`组件的支持

### 第一步

在 `bin/cli.js` 文件中新增组件选项

```js
const TRANSFORMER_INQUIRER_CHOICES = [
  ...,
  // 新增在这里即可
  {
    name: 'Notification',
    value: 'Notification'
  }
]
```

### 第二步

在 `transforms` 目录中添加同名的js文件 - `Notification.js`

### 第三步

可以参考已有的transform代码。也可以使用 [codemod-gpt](https://codemod-gpt.vercel.app) 来生成一份初始的代码，在此基础上修改

### 调试

执行 `npm link`, 之后执行 `semi-codemod`就会运行本地的代码逻辑

修改 `test.jsx` 文件，并执行

`semi-codemod ./test.jsx --dry --print`

查看输出是否符合预期，根据调试结果修改`Notification.js`，直到输出符合预期
