# MIFU_works

Building electron app

1) Install deps:

npm install

2) Command for installing electron-packager :

npm install -g electron-packager

3) Command for building :

npm run build

4) Command for packaging :

electron-packager . appName --platform=win32 --arch=x64 --version=0.36.5 --ignore="node_modules/(babel*|eslint*|react-hot-loader|webpack*|html-webpack-plugin|transfer-webpack-plugin|gulp)

Developing :

'npm run start' in one tab and 'node server_prod_dev.js' in another
