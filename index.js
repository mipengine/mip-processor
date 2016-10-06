/**
 * @file 暴露基类 Processor 的主文件
 * @author errorrik(errorrik@gmail.com)
 */

var MipProcessor = require('./lib/processor');
var objectAssign = require('object-assign');

/**
 * 从 MipProcessor 基类派生一个 Processor 类
 *
 * @param {Object} 派生类成员表
 * @return {Function}
 */
MipProcessor.derive = function (proto) {
    function CustomProcessor(option) {
        MipProcessor.call(this, option);
    }

    var F = new Function();
    F.prototype = MipProcessor.prototype;
    CustomProcessor.prototype = new F();
    objectAssign(CustomProcessor.prototype, proto);
    CustomProcessor.prototype.constructor = CustomProcessor;

    return CustomProcessor;
};

module.exports = exports = MipProcessor;

/**
 * 构建类之间的继承关系
 *
 * @inner
 * @param {Function} subClass 子类函数
 * @param {Function} superClass 父类函数
 */
function inherits(subClass, superClass) {
    /* jshint -W054 */
    var subClassProto = subClass.prototype;
    var F = new Function();
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    objectAssign(subClass.prototype, subClassProto);
    /* jshint +W054 */
}
