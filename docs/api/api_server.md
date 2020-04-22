## 服务端API

**应用在FinChat应用市场上架后，可通过服务端API提供的能力，实现业务需求。**

### 接口说明

#### 格式

**协议：HTTPS**

**数据格式：非文件类型时，统一为JSON**

**编码：UTF-8**

**头部：非文件类型时，POST和PUT请求的Content-Type统一为application/json，app_access_token放在Authorization中，格式为"Bearer ${app_access_token}"**

#### 术语
* app_id：应用的id，创建应用时生成。
* secret：应用的密钥，用于获取access_token和app_access_token。
* app_access_token：开放平台所有接口的调用凭证。
* fcid：FinChat的用户id。
* room_id：聊天会话所在的房间id。

#### 错误约定
错误发生时，会按照一定格式返回错误信息，优先级高于http状态码。错误为FC_UNKNOWN时，应根据http状态码判断错误。

##### 格式

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| errcode | string | 错误码，全局唯一的字符串，具有一定的可读性，对错误的简略描述 |
| error | string | 错误描述，具有可读性，错误的详细描述 |
| data | Object | 错误发生时，可能返回的数据 |

##### 全局错误码 

| errcode | error |
| ---------- | ---------- |
| FC_BAD_JSON | 请求体有误 |
| FC_APP_NOT_FOUND | 应用不存在 |
| FC_APP_NOT_PUBLISHED | 应用未上架 |
| FC_ROOM_NOT_FOUND | 房间不存在 |
| FC_INVALID_SECRET | secret错误 |
| FC_INVALID_ACCESS_TOKEN | access_token错误 |
| FC_MESSAGE_FCID_LIMIT_EXCEEDED | 发送消息的用户个数超出限制 |
| FC_MESSAGE_ROOM_ID_LIMIT_EXCEEDED | 发送消息的房间个数超出限制 |
| FC_INTERNAL_ERROR | 内部错误 |
| FC_UNKNOWN | 未知错误 |


### 授权

#### 获取app_access_token
app_access_token为调用服务端API的唯一凭证，应用必须通过此接口获得app_access_token才能调用其他API。

**请求方式：POST**

**请求地址：/api/v1/finchat/open-api/auth/token**

**请求头部：**

| 参数 | 值 |
| ---------- | ---------- |
| Content-Type | application/json |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| secret | string | 是 | 应用密钥 | - |

**请求示例：**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "secret": "90fa4652-5cd1-4280-ae20-e3d381f9b1fa"
}
```

**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| app_access_token | string | app_access_token，作为其他所有API调用凭证 |
| expires_in | int64 | 过期时间，单位为秒，过期后需要重新调用接口获取 |
| token_type | string | token类型，值为Bearer |

**响应示例：**
```
HTTP/1.1 200 OK
{
    "app_access_token": "18eac85d35a26f989317ad4f02e8bbbb"
    "expires_in": 3600,
    "token_type": "Bearer"
}
```


### 事件订阅
开发者在上架应用的过程中，可以根据需要，指定要订阅的事件，应用上架后，相应的事件发生时，FinChat开放平台会将事件推送至对应的地址中，应用需要响应200状态码。

#### 回调接口

**请求方式：PUT**

**请求地址：开发者填写的地址**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |

**请求参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| token | string | 用于校验的token |
| event | Object | 事件详情 |

**event**

| 参数 | 类型 | 是否必须 | 说明 | 
| ---------- | ---------- | ---------- | ---------- |
| event_id | string | 是 | 事件id |
| type | string | 是 | 事件类型 |
| timestamp | int64 | 是 | 事件发生的事件，单位ms |
| sender | string | 是 | 事件发送者 |
| room_id | string | 否 | 事件相关的房间id |
| room_type | string | 否 | 事件相关的房间类型 |
| fcid | string | 否 | 事件相关的用户id |
| unsigned | Object | 否 | 扩展字段 |

**事件列表**
* 收到直聊房间消息或者群聊房间@应用机器人账号的消息
* 用户和应用机器人账号的直聊房间首次被创建 
* 用户更新CUI卡片
* 用户申请使用应用（仅供默认的管理应用使用）


**示例**

**直聊房间文本消息**
```
{
    "token": "2g7als3DgPW6Xp1xEpmcvgVhQG621bFY",
    "event": {
        "content": {
            "body": "This is an example text message", // 消息体
            "msgtype": "m.text" // 文本消息
        },
        "event_id": "$143273582443PhrSn:example.org",
        "timestamp": 1432735824653,
        "room_id": "!jEsUZKDJdhlrceRyVU:example.org",
        "room_type": "direct_room", // 直聊房间
        "sender": "@example:example.org",
        "type": "m.room.message"
    }
}
```

**群聊房间@应用机器人账号消息**
```
{
    "token": "2g7als3DgPW6Xp1xEpmcvgVhQG621bFY",
    "event": {
        "content": {
            "msgtype": "m.alert", // @应用机器人账号消息
            "body": "@FinChat小助手 test" // 消息体
        },
        "event_id": "$143273582443PhrSn:example.org",
        "timestamp": 1432735824653,
        "room_id": "!jEsUZKDJdhlrceRyVU:example.org",
        "room_type": "multi_room",
        "sender": "@example:example.org",
        "type": "m.room.message"
    }
}
```

**用户和应用机器人账号直聊房间首次被创建**
```
{
    "token": "2g7als3DgPW6Xp1xEpmcvgVhQG621bFY",
    "event": {
        "content": {
            "creator": "@finchat-help-bot:example.org", // 房间创建者账号id
        },
        "event_id": "$143273582443PhrSn:example.org",
        "timestamp": 1432735824653,
        "room_id": "!jEsUZKDJdhlrceRyVU:example.org",
        "room_type": "direct_room",
        "sender": "",
        "fcid": "@alice:example.org", // 加入直聊房间的用户id
        "type": "finstore.room.create"
    }
}
```

**用户操作CUI表单**

content.info的键值对，具体内容请参考[CUI消息格式](https://docs.finogeeks.club/docs/finchat/#/bot?id=cui%E6%B6%88%E6%81%AF%E7%BB%93%E6%9E%84)文档

```
{
    "token": "2g7als3DgPW6Xp1xEpmcvgVhQG621bFY",
    "event": {
        "content": {
            "action": "submit", // 目前仅支持submit
            "info": {
                "key1": "value1", // 更改元素的键值
                "key2": "value2",
                "key3": "value3"
            }
        },
        "event_id": "$143273582443PhrSn:example.org",
        "origin_event": "$153243582843Pxrdn:example.org", // 原CUI消息id
        "timestamp": 1432735824653,
        "room_id": "!jEsUZKDJdhlrceRyVU:example.org",
        "room_type": "direct_room",
        "sender": "@alice:example.org", // 提交表单的用户id
        "fcid": "@alice:example.org", // 表示直聊房间的用户id，群聊房间为空
        "type": "finstore.room.interactcui"
    }
}
```

**用户申请使用应用**

```
{
    "token": "2g7als3DgPW6Xp1xEpmcvgVhQG621bFY",
    "event": {
        "content": {
			"info": [
				{
					"app_id": "461cf042d9eedaa60d445f26dc747d5e",
					"app_name": "测试机器人",
					"fcid": "@test001:example.com",
					"username": "测试账号001"
				}
			]
        },
        "event_id": "$143273582443PhrSn:example.org",
        "timestamp": 1432735824653,
        "sender": "@alice:example.org",
        "type": "finstore.app.application"
    }
}
```

### 消息

#### 发送消息

**支持的消息类型列表**
* 文本消息
* 文本卡片消息
* 图片消息
* 文件消息
* CUI消息

**请求方式：POST**

**请求地址：/api/v1/finchat/open-api/message/send**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| fcids | [string] | 否 | 用户id列表，往应用与用户的直聊房间发送消息，房间必须已存在；room_ids不为空时，忽略此参数 | - |
| room_ids | [string] | 否 | 房间id列表，不为空时，忽略fcids | - |
| content | Object | 是 | 消息内容 | - |

**请求示例：**

**发送文本**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.text", // 文本消息类型
        "body": "hello world" // 消息体
    }
}
```

**发送文件**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.file", // 文件消息类型
        "body": "test.pdf" // 文件名
        "info": {
            "mimetype": "", // MIME类型，文件为空字符串
            "size": 1234242 // 文件大小
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```

**发送图片**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.image", // 图片消息类型
        "body": "test.png" // 图片名
        "info": {
            "mimetype": "image/png", // MIME类型
            "size": 1234242 // 文件大小
            "h": 1334, // 图片高度
            "w": 750 // 图片宽度
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```

**发送文本卡片**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.textcard", // 文本卡片消息类型
        "body": "" // 文本卡片为空字符串
        "info": {
            "title": "测试卡片", // 卡片标题
            "url": "https://example.org/home // 跳转链接
            "description": "测试卡片的内容", // 卡片详情
            "btntext": "发送" // 卡片按钮内容
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```

**发送CUI**

content.info字段具体内容请参考[CUI消息格式](#cui消息格式)章节

```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_id": "!112321588723954859:example.org",
    "content": {
        "body": "[交互卡片]",
        "info": {},
        "msgtype": "m.cui",
        "version": "0.1.0",
    }
}
```


**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id_result | [room_id_result] | 房间发送结果列表 |
| fcid_result | [fcid_result] | 用户发送结果列表 |

**room_id_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id | string | 房间id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空|
| event_id | string | 发送成功时的消息id，失败时为空 |

**fcid_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| fcid | string | 用户id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空 |
| event_id | string | 发送成功时的消息id，失败时为空 |

**响应示例：**
```
HTTP/1.1 200 OK
{
    "room_id_result": [
        {
            "room_id": "!132221587624558592:example.org",
            "errcode": "FC_INTERNAL_ERROR",
            "error": "内部错误"
        }
    ]
}
```

**响应示例：**
```
HTTP/1.1 200 OK
{
    "fcid_result": [
        {
            "fcid": "@test:example.org",
            "event_id": "$143273582443PhrSn:example.org"
        }
    ]
}
```

#### 以用户名义发送消息

**以用户名义发送的消息，需要获取用户授权，授权流程还在完善中，目前先开放接口调用。**

**支持的消息类型列表**
* 文本消息
* 文本卡片消息
* 图片消息
* 文件消息

**请求方式：POST**

**请求地址：/api/v1/finchat/open-api/message/send-as-user**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| sender | string | 是 | 以此用户id名义发送消息 | - |
| fcids | [string] | 否 | 用户id列表，往应用与用户的直聊房间发消息，直聊房间不存在时，后台会自动创建；room_ids不为空时，忽略此参数 | - |
| room_ids | [string] | 否 | 房间id列表，不为空时，忽略fcids | - |
| content | Object | 是 | 消息内容 | - |

**请求示例：**

**发送文本**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "sender": "@user001:example.org",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.text", // 文本消息类型
        "body": "hello world" // 消息体
    }
}
```

**发送文件**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "sender": "@user001:example.org",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.file", // 文件消息类型
        "body": "test.pdf" // 文件名
        "info": {
            "mimetype": "", // MIME类型，文件为空字符串
            "size": 1234242 // 文件大小
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```

**发送图片**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "sender": "@user001:example.org",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.image", // 图片消息类型
        "body": "test.png" // 图片名
        "info": {
            "mimetype": "image/png", // MIME类型
            "size": 1234242 // 文件大小
            "h": 1334, // 图片高度
            "w": 750 // 图片宽度
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```

**发送文本卡片**
```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "sender": "@user001:example.org",
    "room_ids": [
        "!112321588723954859:example.org"
    ],
    "content": {
        "msgtype": "m.textcard", // 文本卡片消息类型
        "body": "" // 文本卡片为空字符串
        "info": {
            "title": "测试卡片", // 卡片标题
            "url": "https://example.org/home // 跳转链接
            "description": "测试卡片的内容", // 卡片详情
            "btntext": "发送" // 卡片按钮内容
        },
        "o_url": "mxc://example.org/66696e6f6765656b732e636c75625e6f4670efda61000110b517" // 文件路径，上传文件时返回
    }
}
```


**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id_result | [room_id_result] | 房间发送结果列表 |
| fcid_result | [fcid_result] | 用户发送结果列表 |

**room_id_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id | string | 房间id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空|
| event_id | string | 发送成功时的消息id，失败时为空 |

**fcid_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| fcid | string | 用户id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空 |
| event_id | string | 发送成功时的消息id，失败时为空 |

**响应示例：**
```
HTTP/1.1 200 OK
{
    "room_id_result": [
        {
            "room_id": "!132221587624558592:example.org",
            "errcode": "FC_INTERNAL_ERROR",
            "error": "内部错误"
        }
    ]
}
```

**响应示例：**
```
HTTP/1.1 200 OK
{
    "fcid_result": [
        {
            "fcid": "@test:example.org",
            "event_id": "$143273582443PhrSn:example.org"
        }
    ]
}
```


#### 更新CUI

**请求方式：PUT**

**请求地址：/api/v1/finchat/open-api/message/update-cui**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| fcids | [string] | 否 | 用户id列表，room_ids不为空时，忽略此参数 | - |
| room_ids | [string] | 否 | 房间id列表，不为空时，忽略fcids | - |
| origin_event | string | 是 | 原CUI消息id | - |
| content | Object | 是 | 消息内容 | - |

**请求示例：**

content.info字段具体内容请参考[CUI消息格式](#cui消息格式)章节

```
{
    "app_id": "5cf29aec6ccfd004ccd28075",
    "room_ids": ["!112321588723954859:example.org"],
    "content": {
        "body": "[交互卡片]",
        "info": {},           
        "msgtype": "m.cui",
        "version": "0.1.0",
    },
    "origin_event": "$22222222:dev.finogeeks.club",
}
```

**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id_result | [room_id_result] | 房间发送结果列表 |
| fcid_result | [fcid_result] | 用户发送结果列表 |

**room_id_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| room_id | string | 房间id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空|
| event_id | string | 发送成功时的消息id，失败时为空 |

**fcid_result**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| fcid | string | 用户id |
| errcode | string | 错误码，成功时为空 |
| error | string | 错误详情，成功时为空 |
| event_id | string | 发送成功时的消息id，失败时为空 |

**响应示例：**
```
HTTP/1.1 200 OK
{
    "room_id_result": [
        {
            "room_id": "!132221587624558592:example.org",
            "errcode": "FC_INTERNAL_ERROR",
            "error": "内部错误"
        }
    ]
}
```

**响应示例：**
```
HTTP/1.1 200 OK
{
    "fcid_result": [
        {
            "fcid": "@test:example.org",
            "event_id": "$143273582443PhrSn:example.org"
        }
    ]
}
```


#### 上传文件

**请求方式：POST**

**请求地址：/api/v1/finchat/open-api/media/upload?app_id=xxx**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | 相应的文件类型 |
| Authorization | "Bearer ${access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |

**请求体：**
以二进制形式上传

**请求示例：**
```
<bytes>
```

**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| content_uri | string | 文件的uri |

**响应示例：**
```
{
    "content_uri": "mxc://example.com/AQwafuaFswefuhsfAFAgsw" 
}
```


### 通讯录信息

#### 根据权限名称获取用户列表

**请求方式：GET**

**请求地址：/api/v1/finchat/open-api/contact/get-users-by-authority?authority_name={authority_name}&app_id=${app_id}**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| authority_name | string | 是 | 权限名称 | - |
| app_id | string | 是 | 应用id | - |


**响应参数说明：**
返回fcid列表


**响应示例：**
```
HTTP/1.1 200 OK
[
    "@test001:dev.finogeeks.club",
    "@test002:dev.finogeeks.club"
]
```


### 用户信息

#### 获取用户详情

**接口后续需要用户授权，目前暂时开放使用**

**请求方式：GET**

**请求地址：/api/v1/finchat/open-api/users/:fcid?app_id=${app_id}**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| fcid | string | 是 | 用户id | - |


**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| fcid | string | 用户id |
| name | string | 用户名 |
| gender | string | 性别 |
| mobile | string | 手机号 |
| landline | string | 座机 |
| position | string | 职级 |
| email | string | 邮箱 |
| job_number | string | 工号 |
| roles | [string] | 角色id列表 |
| groups | [string] | 部门id列表 |


**响应示例：**
```
HTTP/1.1 200 OK
{
    "fcid": "@linian002:dev.finogeeks.club",
    "name": "linian002",
    "gender": "male",
    "mobile": "12346278569",
    "landline": "020-7789898",
    "position": "研发总监",
    "email": "222@qq.com",
    "job_number": "001",
    "roles": [],
    "groups": [
        "d7646430-53b8-11ea-8719-19c1a365f2ff"
    ]
}
```

#### 获取用户好友列表

**接口后续需要用户授权，目前暂时开放使用**

**请求方式：GET**

**请求地址：/api/v1/finchat/open-api/users/:fcid/friendships?app_id=${app_id}**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |
| fcid | string | 是 | 用户id | - |


**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| to_fcid | string | 好友id |
| room_id | string | 与好友的直聊房间id |
| is_bot | bool | 好友是否机器人 |


**响应示例：**
```
HTTP/1.1 200 OK
[
    {
        "to_fcid": "@vsadf-bot:dev.finogeeks.club",
        "room_id": "!224069434157826048:dev.finogeeks.club",
        "is_bot": true
    },
    {
        "to_fcid": "@linian002:dev.finogeeks.club",
        "room_id": "!230427174354550784:dev.finogeeks.club",
        "is_bot": false
    }
]
```


### 应用信息

#### 获取应用加入的直聊房间列表

**接口后续需要用户授权，目前暂时开放使用**

**请求方式：GET**

**请求地址：/api/v1/finchat/open-api/apps/:app_id/friendships**

**请求头部：**

| key | value |
| ---------- | ---------- |
| Content-Type | application/json |
| Authorization | "Bearer ${app_access_token}" |

**请求参数说明：**

| 参数 | 类型 | 是否必须 | 说明 | 默认值 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| app_id | string | 是 | 应用id | - |


**响应参数说明：**

| 参数 | 类型 | 说明 |
| ---------- | ---------- | ---------- |
| to_fcid | string | 加入直聊房间的用户id |
| room_id | string | 直聊房间id |


**响应示例：**
```
HTTP/1.1 200 OK
[
    {
        "to_fcid": "@vsadf-bot:dev.finogeeks.club",
        "room_id": "!224069434157826048:dev.finogeeks.club"
    },
    {
        "to_fcid": "@linian002:dev.finogeeks.club",
        "room_id": "!230427174354550784:dev.finogeeks.club"
    }
]
```

### 身份认证

#### 概述