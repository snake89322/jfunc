###object-prevent-tamper

1、不可拓展对象
Object.preventExtensions(obj); //设置为防拓展对象

虽然不可拓展对象可以防止新添加属性，却不能阻止他人删除属性，当然也不能阻止修改了。所以引出了第二个等级的密封对象。

2、密封对象
Object.seal(obj);//将对象密封

可以看出，密封对象虽然防止了删除，但是还是无法阻止修改，所以就有了最高级别的限制，也就是冻结对象。

3、冻结对象
Object.freeze(man);

最后要注意的就是，一旦对象被设置放篡改对象，则不能撤销，所以需要慎重考虑。

reference: 
http://www.2cto.com/kf/201508/428682.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze