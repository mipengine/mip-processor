mip-processor
===========


MIP Base Processor Class


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
