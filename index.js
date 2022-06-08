const batchMinify = require('./src/minify');

batchMinify(); // me-minify semua file css yang ada di folder minifyThis

// batchMinify(['example1', 'example2', 'example3']); // me-minify semua file css yang di sebutkan di folder minifyThis sesuai urutan

// batchMinify(['example1', 'example2', 'example3'], true); // me-minify semua file css yang di sebutkan di folder minifyThis sesuai urutan dan me restructure hasilnya
