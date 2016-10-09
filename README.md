mip-processor
===========

MIP Base Processor Class


<a href="https://circleci.com/gh/mipengine/mip-processor/tree/master"><img src="https://img.shields.io/circleci/project/mipengine/mip-processor/master.svg?style=flat-square" alt="Build Status"></a>


### usage

```js
var MipProcessor = require('mip-processor');
var less = require('less');

var LessProcessor = MipProcessor.derive({
    name: 'LessCompiler',
    files: ['*.less'],

    processFile: function (file) {
        var paths = [];

        var options = {
            relativeUrls: true,
            compress: true,
            paths: paths,
            filename: file.fullPath
        };

        return less.render(file.data, options).then(
            function (result) {
                file.outputPath = file.outputPath.replace(/\.less$/i, '.css');
                file.setData(result.css);
                return true;
            }
        );
    }
});
```
