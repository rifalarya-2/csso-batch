const fs = require('fs');
const {
  minify,
} = require('csso');
const path = require('path');

/**
 * Fungsi untuk me-minify css secara batch
 * @param {array} list Masukan array untuk mengurutkan file css yang akan di minify
 * @param {boolean} restructure Me-restructure hasil css
 */
function batchMinify(list = [], restructure = false) {
  console.log('Memproses...');

  /**
   *
   * @param {string} dirname lokasi folder untuk me-minify
   * @param {function} onFileContent Callback ketika success
   * @param {funtion} onError Callback ketika terjadi error
   */
  function readFiles(dirname, onFileContent, onError) {
    if (list === []) {
      fs.readdir(dirname, function(err, filenames) {
        if (err) {
          onError(err);
          return;
        }

        filenames.forEach(function(filename) {
          if (filename.search(/[.]css/) !== -1) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
              if (err) {
                onError(err);
                return;
              }

              onFileContent(filename, content);
            });
          }
        });
      });
    } else {
      let result = '';
      list.forEach(function(filename) {
        const data = fs.readFileSync(dirname + filename + '.css', 'utf-8');
        result += data;
      });
      onFileContent('', result);
    }
  }

  const result = new Promise((resolve, reject) => {
    readFiles(path.resolve('minifyThis') + '/', function(filename, content) {
      fs.appendFile('parsed.txt', content, (err) => {
        if (err) reject(console.error(err));

        fs.readFile('parsed.txt', 'utf-8', (err, content) => {
          if (err) reject(console.error(err));

          resolve(content);
        });
      });
    }, function(err) {
      reject(err);
    });
  }).then((e) => minify(e, {
    restructure: restructure,
    comments: false,
  }).css);

  console.clear();
  result.then((e) => {
    try {
      if (!fs.existsSync(path.resolve('build'))) {
        fs.mkdirSync(path.resolve('build'));
      }
    } catch (err) {
      console.error(err);
    }

    fs.writeFile(path.resolve('build/all.css'), e, (err) => {
      if (err) console.error(err);

      console.log(`Berhasil.\nFile yang sudah di minify ada di folder build/all.css`);
      fs.unlink('parsed.txt', ((err) => {
        if (err) console.log('parsed.txt tidak terhapus, ', err);
      }));
    });
  });

  result.catch((err) => console.log(err));
}

module.exports = batchMinify;
