module.exports = {
    plugins: (loader) => [
        require('autoprefixer')({overrideBrowserslist: ['> 0.15% in CN']})
    ]
};
