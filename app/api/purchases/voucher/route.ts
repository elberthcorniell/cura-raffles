import { NextResponse } from 'next/server'
import { Gestiono } from '@bitnation-dev/management/server'
import { sendPurchaseSubmittedEmail, sendPurchaseReceivedCustomerEmail } from '@/lib/email'

const DIVISION_ID = 23

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const voucher = formData.get('voucher') as File
    const raffleId = formData.get('raffleId')
    const ticketQuantity = formData.get('ticketQuantity')
    const totalAmount = formData.get('totalAmount')
    const name = formData.get('name')
    const email = formData.get('email') as string | null
    const whatsappNumber = formData.get('whatsappNumber')
    const accountId = formData.get('accountId')

    // Validate required fields
    if (!voucher || !raffleId || !ticketQuantity || !totalAmount || !name || !whatsappNumber || !accountId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validate WhatsApp number
    if (typeof whatsappNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Número de WhatsApp inválido' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(voucher.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no válido. Solo se aceptan imágenes (JPG, PNG) o PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (voucher.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      )
    }
    Gestiono.errorHandler = async e => {
      return e
    }

    // Convert file to base64
    const arrayBuffer = await voucher.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString('base64')

    // Step 1: Upload file to S3
    const uploadResult = await Gestiono.call<{
      success: number,
      file: {
        id: number,
        url: string,
        public: string,
        s3Key: string
      }
    }, {
      fileName: string,
      fileData: string, // base64 encoded file content
      mimeType: string,
      path?: string,
      createFolder?: boolean
    }>("/v1/files/base64", {
      method: 'POST',
      data: {
        fileName: `${Date.now()}_${voucher.name}`,
        fileData: base64Data,
        mimeType: voucher.type,
        path: 'vouchers',
        createFolder: true
      }
    })

    const fileMetadata = {
      s3Key: uploadResult.file.s3Key,
      fileName: voucher.name,
      url: uploadResult.file.public
    }

    const parsedRaffleId = parseInt(raffleId as string)
    const parsedTicketQuantity = parseInt(ticketQuantity as string)

    // Step 2: Get available serial numbers for the raffle tickets
    const serialNumbersResponse = await Gestiono.call<{
      available: Array<{ serialNumber: string; id: number }>
    }>(`/v1/resource/serial-numbers/${parsedRaffleId}`, {
      method: 'GET',
      query: {
        status: 'AVAILABLE',
        divisionId: String(DIVISION_ID)
      }
    })

    const availableSerials = serialNumbersResponse.available || []

    // Check if we have enough available serial numbers
    if (availableSerials.length < parsedTicketQuantity) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No hay suficientes boletos disponibles. Disponibles: ${availableSerials.length}, Solicitados: ${parsedTicketQuantity}` 
        },
        { status: 400 }
      )
    }

    // Randomly select serial numbers for the tickets
    const shuffledSerials = [...availableSerials].sort(() => Math.random() - 0.5)
    const selectedSerialNumbers = shuffledSerials.slice(0, parsedTicketQuantity).map(s => s.serialNumber)

    // Step 3: Create purchase record with file metadata and serial numbers
    const purchaseRecord = await Gestiono.postPendingRecord({
      type: 'ORDER',
      isSell: true,
      currency: 'DOP',
      divisionId: DIVISION_ID,
      updatePrices: false,
      createFirstInvoice: false,
      generateTaxId: 'none',
      taxInvoiceType: 1,
      isInstantDelivery: true,
      elements: [
        {
          description: 'Boletos de rifa',
          unit: 'boleto',
          quantity: parsedTicketQuantity,
          price: parseFloat(totalAmount as string) / parsedTicketQuantity,
          variation: '0',
          resourceId: parsedRaffleId,
          // @ts-expect-error - serialNumbers is not in the SDK types yet
          serialNumbers: selectedSerialNumbers,
        }
      ],
      payment: {
        paymentMethod: 'TRANSFER',
        accountId: parseInt(accountId as string),
        state: "PENDING",
        metadata: {
          files: [fileMetadata],
        }
      },
      contact: {
        name: name.toString().trim(),
        type: 'CLIENT',
        contact: [
          {
            type: 'whatsapp',
            data: whatsappNumber.toString().trim()
          },
          ...(email?.trim() ? [{
            type: 'email' as const,
            data: email.trim()
          }] : [])
        ]
      },
      metadata: {
        name: name.toString().trim(),
        email: email?.trim() || undefined,
        whatsappNumber: whatsappNumber.toString().trim(),
        totalAmount: parseFloat(totalAmount as string),
        files: [fileMetadata],
        ticketNumbers: selectedSerialNumbers,
        status: 'pending_verification',
        submittedAt: new Date().toISOString()
      }
    })

    console.log('Voucher submission:', {
      raffleId: parsedRaffleId,
      ticketQuantity: parsedTicketQuantity,
      totalAmount,
      name,
      email: email?.trim() || null,
      whatsappNumber,
      file: fileMetadata,
      ticketNumbers: selectedSerialNumbers,
      purchaseId: purchaseRecord.pendingRecordId
    })

    // Send email notification to admin about the new purchase
    sendPurchaseSubmittedEmail({
      customerName: name.toString().trim(),
      customerWhatsapp: whatsappNumber.toString().trim(),
      raffleId: parseInt(raffleId as string),
      ticketQuantity: parseInt(ticketQuantity as string),
      totalAmount: parseFloat(totalAmount as string),
      purchaseId: purchaseRecord.pendingRecordId,
      ticketNumbers: selectedSerialNumbers,
      submittedAt: new Date().toISOString(),
      voucherUrl: fileMetadata.url
    }).catch(error => {
      // Log error but don't fail the request
      console.error('Failed to send purchase notification email:', error)
    })

    // Send confirmation email to customer if they provided an email
    if (email?.trim()) {
      sendPurchaseReceivedCustomerEmail({
        customerName: name.toString().trim(),
        customerEmail: email.trim(),
        ticketQuantity: parseInt(ticketQuantity as string),
        totalAmount: parseFloat(totalAmount as string),
        purchaseId: purchaseRecord.pendingRecordId,
        ticketNumbers: selectedSerialNumbers,
        submittedAt: new Date().toISOString()
      }).catch(error => {
        // Log error but don't fail the request
        console.error('Failed to send customer confirmation email:', error)
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Comprobante recibido exitosamente',
      data: {
        purchaseId: purchaseRecord.pendingRecordId,
        raffleId: parsedRaffleId,
        ticketQuantity: parsedTicketQuantity,
        ticketNumbers: selectedSerialNumbers,
        totalAmount: parseFloat(totalAmount as string),
        name: name.toString().trim(),
        whatsappNumber: whatsappNumber.toString().trim(),
        status: 'pending_verification',
        submittedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Error processing voucher:', error.response.data)
    return NextResponse.json(
      { success: false, error: 'Error al procesar el comprobante' },
      { status: 500 }
    )
  }
}
