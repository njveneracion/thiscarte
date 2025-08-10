import { server } from "@stackpress/ingest/http"

const app = server();

app.get('/', function HomePage(req, res) { 
  res.setHTML('Hello, World');
});
//start the server
app.create().listen(3000, () => {
  console.log('Server is running on http://localhost:30008348367483648');
});