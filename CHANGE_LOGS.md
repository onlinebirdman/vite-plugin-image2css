# todo
[done] 不同环境的产物分开
[done] css产物放在插件不可见的位置即可，不用暴露在目标目录下
[done] cdn-images.lock.json 修改名称（image2css-lock.json）并且默认位置放在项目根目录下
[] 更新文档然后更新npm包
[] options初始化逻辑优化，现在会改到公共配置
[] 插件开发调试环境搭建，提高插件开发和维护效率
[] 添加图片预加载功能：编译阶段写入index.html 只能实现首页的预加载
[] 用unocss解决1px边框问题
[] 打包自动压缩

# features

# docs

# fix&updated
[done] css类模板中，display默认值改为block，原来用的inline-block会出现空白问题
[废弃] background-url 从本地环境的绝对路径改为基于项目的相对路径以免在不同的电脑或者文件夹启动项目时，文件出现变更
[done] 确定哪些产物需要暴露在目标目录下，哪些不需要暴露：应该只有图片的cdn地址映射表需要暴露在目录下共享，其他的css文件可以做到开发者无感知，这样就不用考虑文件路径的问题了; 目前的解决方案是把中间产物生成在项目根目录的.dev文件夹下面；开发者可自行在gitignore中忽略文件夹；而image2css-lock.json文件则生成在项目的根目录下，暂时不支持自定义产路路径；
