## FinChat JS-SDK

### 概述

FinChat JS-SDK 是提供给开发者的基于客户端内的网页开发工具包。

通过使用 JS-SDK，开发者可以调用客户端内的相关能力。

### 开始使用

#### 1、引入 js 文件

```html
<script src="path/to/fc.sdk.js"></script>
```

#### 2、调用 config 注入配置信息

**调用接口前必须先调用 config 注入配置信息**

```javascript
fc.config({
  debug: true
})
```

#### 3、调用 ready 接口处理加载完成

```javascript
fc.ready(() => {
  // 后续所有接口的调用都必须在 ready 后执行
})
```

#### 接口调用说明

接口参数结构：
```javascript
fc.someFunction({
  param1: 'xxx',
  param2: 'xxx'.
  onSuccess() {
    // 接口调用成功后执行
  },
  onFail() {
    // 接口调用失败后执行
  },
  onComplete() {
    // 接口调用完成后执行
  }
})
```

部分接口是异步接口，支持传入 onSuccess、onFail、onComplete，异步接口本身也是一个 Promise，也可以通过以下方式执行：
```javascript
const res = await fc.someFunction({
  param1: 'xxx',
  param2: 'xxx'
})
```

后文接口文档不再单独说明 onSuccess、onFail、onComplete 参数，请注意。

同步接口不需要传 onSuccess、onFail、onComplete 参数，直接执行即可

```javascript
const res = fc.someSyncFunction()
```

接口返回的数据有以下统一结构：
```javascript
// 成功时的返回
{
  status: 'ok',
  data: {
    // some data here
  }
}
```

```javascript
// 失败时的返回
{
  status: 'fail',
  message: 'error' // error 说明
}
```

### 联系人组件

#### 调起联系人组件

**fc.openContactModal(options)**

弹出客户端的联系人选择组件（含组织），选择完成并确认后会执行 onSuccess 返回数据。

options 参数：

| 名称         | 类型  | 必填 | 备注                    |
| :----------- | :---- | :--- | :---------------------- |
| selectedList | Array | 否   | id 列表，默认选中的用户 |

使用说明：
```javascript
const res = await fc.openContactModal({
  selectedList: [],
  onSuccess(res) {
    console.log(res.data.list) // 返回选中的联系人数组
  }
})
```

#### 调起联系人组件（好友列表）

**fc.openFriendModal(options)**

弹出客户端的联系人选择组件（仅包含好友），选择完成并确认后会执行 onSuccess 返回数据。

options 参数：

| 名称         | 类型    | 必填 | 备注                    |
| :----------- | :------ | :--- | :---------------------- |
| selectedList | Array   | 否   | id 列表，默认选中的用户 |
| isRadio      | Boolean | 否   | 是否单选                |

使用说明：
```javascript
const res = await fc.openFriendModal({
  selectedList: [],
  onSuccess(res) {
    console.log(res.data.list) // 返回选中的联系人数组
  }
})
```

### 其他

#### 使用系统默认浏览器打开链接

**fc.openExternalUrl(options)**

调用后会使用系统默认浏览器打开链接，可用于打开文件链接

options 参数：

| 名称 | 类型   | 必填 | 备注           |
| :--- | :----- | :--- | :------------- |
| url  | String | 是   | 需要打开的链接 |

```javascript
fc.openExternalUrl({
  url: 'https://www.finogeeks.com/'
})
```
