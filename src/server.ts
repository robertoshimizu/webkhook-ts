import express, { type Request, type Response } from 'express'
import crypto from 'crypto'
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

async function verifySignature (req: Request): Promise<boolean> {
  const signature = req.headers['x-vercel-signature'] as string
  const expectedSignature = crypto
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    .createHmac('sha1', process.env.SECRET ?? '')
    .update(JSON.stringify(req.body))
    .digest('hex')

  return signature === expectedSignature
}

// Define a route handler for the default home page
app.get('/', (req: Request, res: Response) => {
  res.setHeader('x-vercel-verify', '2db18a8b263d9a57c297e19ce0d4e4e34d33ed67')
  res.sendStatus(200)
})

interface WebhookData {
  id: string
  message?: string
  timestamp: number
  type: string
  requestId: string
  statusCode: number
  level: string
  proxy: {
    timestamp: number
    region: string
    clientIp: string
    referer: string
    path: string
    host: string
    scheme: string
    method: string
    userAgent: string[] // If the array has a more specific type, replace string[] accordingly
  }
  projectId: string
  projectName: string
  deploymentId: string
  source: string
  host: string
  path: string
  environment: string
  branch: string
}

// Add support for GET requests to our webhook
// Used to verify the webhook
app.get('/log-drain', async (req, res) => {
  // Parse the query params
  console.log('Got /webhook')
  const isValid = await verifySignature(req)
  if (!isValid) {
    // If the signature does not match, respond with 401 Unauthorized
    return res.status(401).send('Unauthorized')
  }
  res.setHeader('x-vercel-verify', '2db18a8b263d9a57c297e19ce0d4e4e34d33ed67')
  res.sendStatus(200)
})

// Define a webhook endpoint
app.post('/log-drain', async (req: Request, res: Response) => {
  const isValid = await verifySignature(req)
  if (!isValid) {
    // If the signature does not match, respond with 401 Unauthorized
    return res.status(401).send('Unauthorized')
  }

  const data: [WebhookData] = req.body

  console.log('Received webhook:', data.map((log) => { return (log.message != null) && log.message }))

  // console.log('Received webhook:', data.source)

  // Respond to the request indicating success
  // res.setHeader('x-vercel-verify', '2db18a8b263d9a57c297e19ce0d4e4e34d33ed67')
  res.status(200).send({ status: 'Received' })
})

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at ${baseUri}:${port}/`)
})
