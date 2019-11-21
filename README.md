# blog-svc-node
> By koa & typescript & mongo & redis

### 运行

1. 
```
macos/linux : npm run build
windows : npm run buildw
```
2. vscode 启动调试（F5）


### 部署

```
$ tsc

$ docker build -t blog_ser .
// 镜像中需要目录或文件: /dist config.json package.json 
$ docker run blog_ser
```

### 配置

```
{
  "port": "8999",
  "wspost": "7999",
  "cors": {
    "development": "*",
    "production": "https://zyhua.cn,https://www.zyhua.cn,https://admin.zyhua.cn"
  },
  "log": {
    "log_name": "log",
    "log_path": "logs/"
  },
  "mongo": {
    "development": "mongodb://webtest:zyhuatest@blog_mongo:27017/webtest",
    "production": "mongodb://webtest:zyhuatest@blog_mongo:27017/webtest"
  },
  "redis": {
    "development": {
      "host": "blog_redis",
      "port": 6300,
      "pwd": "password"
    },
    "production": {
      "host": "blog_redis",
      "port": 6300,
      "pwd": "password"
    }
  },
  "session": {
    "secrets": "secrets"
  },
  "jwt": {
    "secret": "secret",
    "key": "key",
    "overtime": "10800000",
    "settlingtime": "3600000"
  },
  "user": {
    "salt": "salt"
  },
  "upload": {
    "maxUploadSize": 10,
    "uploadDir": {
      "article": "/upload/article",
      "profile": "/upload/profile"
    },
    "host": {
      "development": "http://127.0.0.1:8999",
      "production": "http://static.zyhua.cn"
    }
  },
  "ssl": {
    "key": "/ssl/2_api.zyhua.cn.key",
    "crt": "/ssl/1_api.zyhua.cn_bundle.crt"
  }
}
```
