module.exports = function(grunt) {

    // ������������
    grunt.initConfig({
        //��ȡpackage.json�����ݣ��γɸ�json����
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            //�ļ�ͷ�������Ϣ
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            //������������
            build: {
                //Դ�ļ�
                src: 'src/hello-grunt.js',
                //Ŀ���ļ�
                dest: 'build/hello-grunt-min.js'
            }
        }
    });

    // ����ָ���������
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Ĭ��ִ�е�����
    grunt.registerTask('default', ['uglify']);
};