
## 在网页上引入Live2D看板娘(仅限于Cubism 3模型)

### 使用方法

1.将项目解压并放入web容器或者使用Nginx或Apache等工具反向代理来请求模型资源(由于使用AJAX异步加载)
 - 没测试过本地请求是否成功
 
2.修改你的资源请求路径
 - 模型默认可放在Resource下
 
3.打开网站运行显示
 - 如果出现跨域问题，请最好本地调试
 - 本Demo可以配合大佬写的waifu.js来实现其他功能 

### 注意事项

 - 由于加载模型动作等需要调用PIXI的请求去加载，所以对于本地资源，最好使用web容器或反向代理工具来实现模拟网络环境
 - 如果你熟悉PIXI的其他请求资源方式，可以尝试修改请求资源方式，调用第一种加载模型方式，自己请求并加载资源
 - 如果是CDN资源，最好使用第二种方式进行加载模型，比较方便
 - 多模型加载未优化浏览器内存，加载过多会导致内存偏大，或许降低在页面正常浏览网页的速度等性能
 
#### 代码命名注释等不规范会慢慢修改

## NOTICE (注意，非常重要)

基于 EULA 协议，请勿提交SDKs源代码到仓库里！请勿修改framework中的文件！

Baseed on EULA ，DO NOT pull Cubism SDKs on repositorie!DO NOT modify fiels in folder framework !

违反上述规定由此引发的任何法律纠纷，由违反者承担相应责任!

Any legal dispute arising from the violation of the above provisions shall be the responsibility of the violators!

如果你是fork该仓库，也请不要自己放SDK进自己的仓库里，这将违反Live2D公司对于SDK的不可再分发原则

## LICENSE

由于文件基于Live2D 的开源git项目编写，所以以下文件遵循 GNU General Public License, version 2

- [GNU General Public License, version 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
   - loadModel.js
   
Live2D Cubism Core は Live2D Proprietary Software License で提供しています。
 - Live2D Proprietary Software License 
[日本語](http://www.live2d.com/eula/live2d-proprietary-software-license-agreement_jp.html) 
[English](http://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html) 
   - live2dcubismcore.min.js

Live2D Cubism Components は Live2D Open Software License で提供しています。
 - Live2D Open Software License 
[日本語](http://www.live2d.com/eula/live2d-open-software-license-agreement_jp.html) 
[English](http://www.live2d.com/eula/live2d-open-software-license-agreement_en.html) 
   - live2dcubismframework.js
   - live2dcubismpixi.js

直近会計年度の売上高が 1000 万円以上の事業者様がご利用になる場合は、SDKリリース(出版許諾)ライセンスに同意していただく必要がございます。 
- [SDKリリース(出版許諾)ライセンス](http://www.live2d.com/ja/products/releaselicense) 

*All business* users must obtain a Publication License. "Business" means an entity  with the annual gross revenue more than ten million (10,000,000) JPY for the most recent fiscal year.
- [SDK Release (Publication) License](http://www.live2d.com/en/products/releaselicense)

