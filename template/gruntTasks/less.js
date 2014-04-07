module.exports = {
  common: {
    options: {
      ieCompat: true,
      paths: ['./less/'],
      compress: true,
      syncImport: true
    },
    files: [
            {
              expand: true,
              cwd: './less/custom/',
              src: ['*.less'],
              dest: './styles/',
              ext: '.css'
            }
          ]
    }
};