const path = require('path');
const webpackDefault = require('@ionic/app-scripts/config/webpack.config');
const webpackMerge = require('webpack-merge');

const customConfig = {
    dev: {
        resolve: {
            alias: {
                '@globals': path.resolve('./src/globals'),
                '@shared': path.resolve('./src/shared'),
                '@shared/*': path.resolve('./src/shared/*'),
                '@pages': path.resolve('./src/pages'),
                '@pages/*': path.resolve('./src/pages/*'),
                '@networking': path.resolve('./src/networking'),
                '@networking/*': path.resolve('./src/networking/*'),
                '@test': path.resolve('./src/test'),
                '@test/*': path.resolve('./src/test/*')
            }
        }
    },
    prod: {
        resolve: {
            alias: {
                '@globals': path.resolve('./src/globals'),
                '@shared': path.resolve('./src/shared'),
                '@shared/*': path.resolve('./src/shared/*'),
                '@pages': path.resolve('./src/pages'),
                '@pages/*': path.resolve('./src/pages/*'),
                '@networking': path.resolve('./src/networking'),
                '@networking/*': path.resolve('./src/networking/*'),
                '@test': path.resolve('./src/test'),
                '@test/*': path.resolve('./src/test/*')
            }
        }
    }
}

module.exports = webpackMerge(webpackDefault, customConfig);
