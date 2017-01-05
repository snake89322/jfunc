## Loader使用方法

```javascript
var src = [
  'http://www.east.com.cn/Site/Default/theme/js/three.min.js',
  '//cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
  'http://www.east.com.cn/Site/Default/theme/modules/bootstrap/css/bootstrap.min.css',
  'http://img2.niutuku.com/1312/0831/0831-niutuku.com-28071.jpg',
  'bad link'
];

var loader = new _$.Loader(
  function () {
    console.log('outStep: ' + this.percent);
  },
  function () {
    $('.loader').fadeOut(function() {
      new _$.Loader(
        function () {
          console.log('innerStep: ' + this.percent);
        },
        function () {
          
        },
        "Loader.js" // 详见test文件夹
      )
    });
  },
  src				
);
```

