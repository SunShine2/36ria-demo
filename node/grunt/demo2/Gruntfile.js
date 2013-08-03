module.exports = function(grunt) {

    grunt.initConfig({
        pkg: {author:"minghe",email:"minghe@36@gmail.com"},
        //任务：压缩文件
        uglify: {
            bar: {
                options: {
                    banner: '/*! <%= pkg.author %>*/',
                    //添加文字到压缩后的文件尾部
                    footer:'/*! 这是压缩文件尾部 */',
                    //美化代码
                    beautify: {
                        //中文ascii化，非常有用！防止中文乱码的神配置
                        ascii_only: true
                    }

                }
            }
        }
    });

    grunt.registerTask('default', ['uglify:bar']);

    // 构建任务配置
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            //文件头部输出信息
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            //具体任务配置
            build: {
                //源文件
                src: 'src/hello-grunt.js',
                //目标文件
                dest: 'build/hello-grunt-min.js'
            }
        }
    });

    // 加载指定插件任务
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认执行的任务
    grunt.registerTask('default', ['uglify']);
};