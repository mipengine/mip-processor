/**
 * @file MIP Base Processor Class
 * @author errorrik(errorrik@gmail.com)
 */

var objectAssign = require('object-assign');
var minimatch = require('minimatch');

/**
 * 构建功能类
 *
 * @param {Object} options 构建参数
 * @param {Array} options.files 选择要处理的文件
 */
function Processor(options) {
    objectAssign(
        this,
        options
    );
}

/**
 * 要处理的文件选取，默认所有文件
 */
Processor.prototype.files = [];

/**
 * 开始处理
 *
 * @param {mip-builder} builder 构建器对象
 * @return {Promise}
 */
Processor.prototype.process = function (builder) {
    var filePatterns = this.files;
    var files = typeof builder.getFiles === 'function'
        ? builder.getFiles()
        : builder.processFiles;

    files = files
        .filter(function (file) {
            var isMatch = true;

            filePatterns.forEach(function (filePattern) {
                isMatch = isMatch && minimatch(
                    file.relativePath,
                    filePattern,
                    {matchBase: true, dot: true}
                );
            });

            return isMatch;
        });

    var name = this.name || 'Unnamed';
    var startTime = new Date();
    builder.notify({
        type: 'PROCESS_PROCESSOR_START',
        body: name + ' processing ...'
    });

    var resultPromise = Promise.resolve();
    files.forEach(function (file, index) {
        resultPromise = resultPromise.then(function () {
            builder.notify({
                type: 'PROCESS_FILE',
                body: this.name + ' - [' + (index + 1) + '/' + files.length + '] ' + file.relativePath
            });


            var processFilePromise = this.processFile(file, builder);
            if (!(processFilePromise instanceof Promise)) {
                processFilePromise = Promise.resolve(processFilePromise);
            }

            return processFilePromise;
        }.bind(this));
    }, this);

    return resultPromise.then(function () {
        builder.notify({
            type: 'PROCESS_PROCESSOR_END',
            body: name + ' done! (' + (new Date() - startTime) + 'ms)'
        });
    });
};

/**
 * 单一文件处理，通常用于override
 *
 * @return {Promise}
 */
Processor.prototype.processFile = function () {
    // TODO: how to notice builder, im finished
    return Promise.resolve();
};

module.exports = exports = Processor;

