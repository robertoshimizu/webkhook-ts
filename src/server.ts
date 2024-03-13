import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()
let baseUri: string | undefined

if (process.env.NODE_ENV === 'production') {
  baseUri = process.env.PRODUCTION_URL
} else {
  baseUri = process.env.DEVELOPMENT_URL
}
console.log('baseUri:', baseUri)

// Create a new express application instance
const app: express.Application = express()

// The port the express app will listen on
const port: number = (process.env.PORT != null) ? parseInt(process.env.PORT) : 3000

// Support JSON payloads
app.use(express.json())

// Define a route handler for the default home page
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world of minecraft!')
})

// Define a webhook endpoint
app.post('/webhook', (req: Request, res: Response) => {
  console.log('Received webhook:', req.body)

  // Respond to the request indicating success
  res.status(200).send({ status: 'Received' })
})

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at ${baseUri}:${port}/`)
})
