const http = require('http');
const fs = require('fs');
const path = require('path');
const React = require('../../build/modules/React.js');
const ReactDOMServer = require('../../build/modules/ReactDOMServer.js');

const serverMarkup = ReactDOMServer.renderToString(React.DOM.p(null, 'Contents rendered on the server'));

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Server Rendering Example</title>
</head>
<body>
  <h1>Server Rendering Example</h1>
  <div id="container">${serverMarkup}</div>
  
  <script src="/build/react.js"></script>
  <script src="/build/react-dom.js"></script>
  <script>
    ReactDOM.render(
      React.DOM.p(null, 'Contents rendered on the client'),
      document.getElementById('container')
    );
  </script>
</body>
</html>
`;

console.info('Starting server on port 8080');

http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } else if (req.url.startsWith('/build/')) {
    fs.readFile(path.join(__dirname, '..', '..', req.url), (err, file) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(file);
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(8080);
