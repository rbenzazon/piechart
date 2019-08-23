# piechart
displays a pie chart and several other metrics

## install :
```
git clone https://github.com/rbenzazon/piechart.git
npm install
```

## build :
```
npm run build
```

## test :
```
npm run build
```
*then*
```
npm test
```
In case of an error, you might need to install 2 package(don't know if npm install will correctly download it)
```
npm install -g web-component-tester
npm i wct-browser-legacy --save-dev
```


## start dev mode with dev server
first start the mock-json-server with sample data :
```
mock-json-server src/mockServerData.json
```
then start the dev-server with watch and auto reload :
```
npm run start
```