# QM 本地 socket 通讯文档

## QM 的本地 socket 服务

QM 会作为服务端、基于 socket.io 启动一个本地 socket 服务，地址一般是 http://localhost:8686 或 127.0.0.1:8686。因此，其他端或应用（作为客户端）可使用 socket.io，连接到 QM 的本地服务上，与 QM 进行一系列的交互和数据传输。

后面会详细介绍如何使用 socket.io 并连接到 QM 进行交互，示例代码均通过 socket.io 的 web 客户端版本演示，所有例子均已通过测试，均可运行。

## 使用方法

### 1、安装
Web 端：

web 页面引入 socket.io.js
```html
<script src="/path/to/socket.io.js"></script>
```
或使用 cdn
```html
<script src="https://cdn.bootcss.com/socket.io/2.3.0/socket.io.js"></script>
```


### 2、连接
```js
const socket = io.connect('http://127.0.0.1:8686')

// 监听 connected 事件
socket.on('connected', () => {
  console.log('connected')
})
```
通过调用 io.connect 进行连接，连接成功后，QM 会发送 connected 事件到客户端表示已连接成功。每个连接仅会触发一次 connected 事件。

### 3、监听事件和发送信息
```js
// 监听 QM 发送的 response 事件
socket.on('response', (data) => {
  console.log('response', data)
})

// 向 QM 发送 request 事件
socket.emit('request', { key: 'some data' })
```
通过 socket.on 可以监听服务端返回的事件。

通过 socket.emit 则可以向服务端发送事件。

### 4、断开连接
```js
// 监听 disconnected 事件
socket.on('disconnected', () => {
  console.log('disconnected')
})

// 向 QM 发送断开连接的请求
socket.disconnect(true)
```
断开当前的连接，若 disconnect 后再 emit 事件，QM 将不会收到数据，也不会有任何响应。

## 与 QM 的交互

当前 QM 主要通过两个大类型的事件来进行交互

### 1、request 事件

```js
// 向 QM 发送 request 事件
socket.emit('request', { 
  key: 'some api key',
  data: {
    a: 1,
    b: 2
  }
})
```

客户端要调用 QM 的相关接口，主要通过发起 request 事件，接口调用成功后，会通过发送 response 返回对应的数据。

事件参数如下：

| name | type   | required | desc                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| key  | String | true     | 要调用 QM 的接口名称                                         |
| data | Object | -        | 接口所需的参数，不同接口所需参数不一样，请参阅具体的接口文档 |

### 2、response 事件
```js
// 监听 QM 发送的 response 事件
socket.on('response', (res) => {
  console.log(res)
})
```

客户端发起 request 后，待 QM 处理完毕，会向客户端发送 response 事件，返回数据。

response 事件回调函数的参数如下：

| name    | type   | desc                             |
| :------ | :----- | :------------------------------- |
| key     | String | 调用的接口                       |
| data    | Object | 对应接口执行后返回的数据（若有） |
| errCode | Number | 接口调用错误后的错误码           |
| errMsg  | String | 接口调用出错后的错误信息         |

举个例子，调用 sendMessage 后，监听到 response 事件有返回，res 可能有以下类型：

sendMessage 执行成功，res 为：
```json
{
  key: 'sendMessage'
}
```

sendMessage 执行失败，用户未登录，res 为：
```json
{
  key: 'sendMessage',
  errCode: 10001,
  errMsg: 'Not Logged In'
}
```

sendMessage 执行失败，产生了其他错误，res 为：
```json
{
  key: 'sendMessage',
  errCode: 10003,
  errMsg: 'Unknown Error'
}
```


## API 一览

### sendMessage 

调用后 QM 会打开房间选择组件，选择完成后会向所选房间发送消息。

Example：

```js
socket.emit('request', {
  key: 'sendMessage',
  data: {
    msgType: 'm.text',
    body: '这是标题',
    info: {
      // some other data
    }
  }
})
```

sendMessage 的 data 参数：

| name    | type   | Required | desc |
| :------ | :----- | :------- | :--------------------------------- |
| msgType | String | true     | 消息类型，当前仅支持 m.textcard    |
| body    | String | true     | 消息标题                           |
| info    | Object | true     | 消息结构体，不同类型消息有不同结构 |

m.textcard 类型的 info 参数：

| name    | type   | Required | desc |
| :------ | :----- | :------- |:------------------------------- |
| title   | String | true     | 消息卡片标题，应当与 body 一致                     |
| desc    | String | true     | 消息卡片描述，可使用 \n 换行                       |
| url     | String | false    | 点击卡片后需要打开的链接                           |
| btnText | String | false    | 消息卡片按钮文案，若不设则显示默认文案【显示详情】 |

Example：
```js
socket.emit('request', {
  key: 'sendMessage',
  data: {
    msgType: 'm.textcard',
    body: '这是标题',
    info: {
      title: '这是标题',
      desc: '行1：这是描述\n行2：这是描述这是描述\n行3：这是描述这是描述这是描述这是描述这是描述这是描述',
      url: "https://www.baidu.com",
      btnText: '打开'
    }
  }
})
```
![m.textcard 消息](https://pic.imgdb.cn/item/5e5f799298271cb2b80f14b2.png)

