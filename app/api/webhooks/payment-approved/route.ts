import { NextResponse } from 'next/server'
import { sendPaymentApprovedEmail, sendPaymentApprovedAdminEmail } from '@/lib/email'
import { Gestiono, type GestionoSchema } from '@bitnation-dev/management/server'

// Webhook secret for validation (optional but recommended)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

type PaymentApprovedWebhookPayload = {
  type: 'record:updated'
  payload: {
    recordId: GestionoSchema['record']['id']
    editorId: GestionoSchema['user']['id']
    old: Partial<GestionoSchema['record']>
    new: Partial<GestionoSchema['record']>
  }
}

// Record states
type RecordState = 'PENDING' | 'COMPLETED' | 'CANCELLED'

/**
 * Validates the webhook signature if a secret is configured
 */
function validateWebhookSignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET) {
    // If no secret is configured, skip validation
    return true
  }

  if (!signature) {
    return false
  }

  // Simple HMAC validation - adjust based on your webhook provider
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Extracts customer contact info from the record
 */
async function extractContactInfo(recordId: GestionoSchema['record']['id']): Promise<{
  customerName: string
  customerWhatsapp: string
  customerEmail?: string
}> {
  // Default values
  const record = await Gestiono.getRecordById(recordId)
  const beneficiary = await Gestiono.getBeneficiaryById({ beneficiaryId: record.beneficiaryId })
  return { 
    customerName: beneficiary.name, 
    customerWhatsapp: beneficiary.contactData?.find(d => d.type === 'whatsapp')?.data, 
    customerEmail: beneficiary.contactData?.find(d => d.type === 'email')?.data 
  }
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature validation
    const rawBody = await request.text()

    // Validate webhook signature if configured
    const signature = request.headers.get('x-webhook-signature') ||
      request.headers.get('x-signature') ||
      request.headers.get('authorization')

    if (WEBHOOK_SECRET && !validateWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    let payload: PaymentApprovedWebhookPayload
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate event type - only process record:updated events
    if (payload.type !== 'record:updated') {
      console.log(`Ignoring webhook event: ${payload.type}`)
      return NextResponse.json({
        success: true,
        message: `Event ${payload.type} ignored`
      })
    }

    const { old: oldRecord, new: newRecord, recordId } = payload.payload

    // Get old and new states
    const oldState = oldRecord.state as RecordState | undefined
    const newState = newRecord.state as RecordState | undefined

    // Only process if state changed TO 'COMPLETED' FROM something else (not already COMPLETED)
    if (newState !== 'COMPLETED') {
      console.log(`Ignoring record:updated - new state is not COMPLETED: ${newState}`)
      return NextResponse.json({
        success: true,
        message: 'Record state is not COMPLETED, ignoring'
      })
    }

    if (oldState === 'COMPLETED') {
      console.log(`Ignoring record:updated - old state was already COMPLETED`)
      return NextResponse.json({
        success: true,
        message: 'Record was already COMPLETED, ignoring'
      })
    }

    console.log(`Payment approved: Record ${recordId} changed from ${oldState} to ${newState}`)

    // Extract contact info from the record
    const { customerName, customerWhatsapp, customerEmail } = await extractContactInfo(recordId)

    // Extract purchase details from the record or related pending record
    const amount = newRecord.amount || 0
    const metadata = newRecord.metadata as any

    // Get raffle info from metadata if available
    const raffleId = metadata?.raffleId || 0
    const raffleName = metadata?.raffleName || undefined
    const ticketQuantity = metadata?.ticketQuantity || 1
    const ticketNumbers = metadata?.ticketNumbers || []

    console.log('Payment approved webhook received:', {
      recordId,
      customerName,
      ticketQuantity,
      totalAmount: amount,
      oldState,
      newState
    })

    const approvedAt = new Date().toISOString()

    const emailData = {
      customerName,
      customerWhatsapp,
      customerEmail,
      raffleId,
      raffleName,
      ticketQuantity,
      totalAmount: amount,
      purchaseId: recordId,
      ticketNumbers,
      approvedAt
    }

    // Send email notifications in parallel
    const emailPromises: Promise<boolean>[] = []

    // Send notification to customer if they have an email
    if (customerEmail) {
      emailPromises.push(
        sendPaymentApprovedEmail(emailData).catch(error => {
          console.error('Failed to send customer email:', error)
          return false
        })
      )
    }

    // Always send notification to admin
    emailPromises.push(
      sendPaymentApprovedAdminEmail(emailData).catch(error => {
        console.error('Failed to send admin email:', error)
        return false
      })
    )

    const results = await Promise.all(emailPromises)
    const allEmailsSent = results.every(result => result)

    return NextResponse.json({
      success: true,
      message: 'Payment approved webhook processed',
      data: {
        recordId,
        previousState: oldState,
        newState,
        emailsSent: allEmailsSent,
        customerEmailSent: customerEmail ? results[0] : null,
        adminEmailSent: results[results.length - 1]
      }
    })
  } catch (error) {
    console.error('Error processing payment approved webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification (some services require this)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const challenge = url.searchParams.get('challenge') || url.searchParams.get('hub.challenge')

  if (challenge) {
    // Return the challenge for webhook verification
    return new Response(challenge, { status: 200 })
  }

  return NextResponse.json({
    success: true,
    message: 'Payment approved webhook endpoint is active',
    endpoints: {
      POST: 'Send record:updated event to trigger email notifications when payment state changes to COMPLETED'
    }
  })
}
