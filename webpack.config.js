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
                '@pages/*': path.resolve('./src/pages/*')
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
                '@pages/*': path.resolve('./src/pages/*')
            }
        }
    }
}

module.exports = webpackMerge(webpackDefault, customConfig);