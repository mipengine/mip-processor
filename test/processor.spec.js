var Processor = require('../index');

function MockFile(options) {
    this.setData(options.data);
    this.relativePath = options.relativePath;
    this.fullPath = options.fullPath;
}

MockFile.prototype.setData = function (data) {
    this.data = data
};


MockFile.prototype.getData = function () {
    return this.data;
};


function MockBuilder() {
    this.files = [
        new MockFile({
            data: '1',
            fullPath: '/project/1.js',
            relativePath: '1.js'
        }),
        new MockFile({
            data: '2',
            fullPath: '/project/2.js',
            relativePath: '2.js'
        }),
        new MockFile({
            data: '3',
            fullPath: '/project/3.js',
            relativePath: '3.js'
        }),
        new MockFile({
            data: '4',
            fullPath: '/project/4.js',
            relativePath: '4.css'
        }),
        new MockFile({
            data: '1',
            fullPath: '/project/dep/1.js',
            relativePath: 'dep/1.js'
        }),
        new MockFile({
            data: '2',
            fullPath: '/project/dep/2.js',
            relativePath: 'dep/2.js'
        }),
        new MockFile({
            data: '2',
            fullPath: '/project/dep/2.css',
            relativePath: 'dep/2.css'
        }),
        new MockFile({
            data: 'root = true',
            fullPath: '/project/.editorconfig',
            relativePath: '.editorconfig'
        })
    ];
}

MockBuilder.prototype.getFiles = function () {
    return this.files;
};

MockBuilder.prototype.notify = function () {};

describe("Processor Base", function () {

    it("merge options when constructor run", function () {
        var processor = new Processor({
            a: 1,
            b: '2'
        });

        expect(processor.a).toBe(1);
        expect(processor.b).toBe('2');
    });

    it("default select no file", function () {
        var processor = new Processor();
        var files = processor.selectFiles(new MockBuilder());

        expect(files instanceof Array).toBeTruthy();
        expect(files.length).toBe(0);
    });

    it("dont select hidden file", function () {
        var processor = new Processor({
            files: ['**/*']
        });
        var files = processor.selectFiles(new MockBuilder());

        expect(files instanceof Array).toBeTruthy();
        expect(files.length).toBe(7);
        files.forEach(function (file) {
            expect(/(^\.|\/\.)/.test(file.relativePath)).toBe(false);
        });
    });

    it("complex select files", function () {
        var processor = new Processor({
            files: [
                '**/*.js',
                '!dep/*.js',
                'dep/*.css',
                'dep/2.js'
            ]
        });
        var files = processor.selectFiles(new MockBuilder());

        expect(files instanceof Array).toBeTruthy();
        expect(files.length).toBe(5);
        files.forEach(function (file) {
            expect(file.relativePath.indexOf('dep/1.js') < 0).toBeTruthy();
        });
    });

    it("files option should be override by constructor options", function () {
        var processor = new Processor({
            files: ['**/*.js']
        });

        expect(processor.files instanceof Array).toBeTruthy();
        expect(processor.files.length).toBe(1);
    });

    it("files option should be override by constructor options", function () {
        var processor = new Processor({
            files: ['**/*.js']
        });

        expect(processor.files instanceof Array).toBeTruthy();
        expect(processor.files.length).toBe(1);
    });

    it("derive, override processFile, return Promise", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        file.setData(file.getData() + 1);
                        resolve();
                    }, 1);
                });
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getFiles();
            expect(files[0].getData()).toBe('11');
            expect(files[1].getData()).toBe('21');
            expect(files[2].getData()).toBe('31');
            done();
        });
    });

    it("derive, override processFile, sync, return nothing", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                file.setData(file.getData() + 1);
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getFiles();
            expect(files[0].getData()).toBe('11');
            expect(files[1].getData()).toBe('21');
            expect(files[2].getData()).toBe('31');
            done();
        });
    });


    it("derive, files should be filter", function (done) {
        var CustomProcessor = Processor.derive({
            processFile: function (file) {
                file.setData(file.getData() + 1);
            }
        });
        var processor = new CustomProcessor({
            files: ['**/*.js']
        });

        var builder = new MockBuilder();
        processor.process(builder).then(function () {
            var files = builder.getFiles();
            expect(files[0].getData()).toBe('11');
            expect(files[1].getData()).toBe('21');
            expect(files[2].getData()).toBe('31');
            expect(files[3].getData()).toBe('4');
            done();
        });
    });
});
