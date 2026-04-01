import { NextResponse } from 'next/server'
import { Gestiono } from '@bitnation-dev/management/server'

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Número de teléfono inválido' },
        { status: 400 }
      )
    }

    // Step 1: Find the beneficiary (contact) by phone number
    const beneficiaries = await Gestiono.getBeneficiaries({ search: phone.trim().replace(/^\+/, '') })

    if (!beneficiaries || beneficiaries.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          contact: null,
          tickets: [],
        },
        message: 'No se encontraron registros para este número'
      })
    }

    const contact = beneficiaries[0]

    // Step 2: Get all pending records (orders) for this beneficiary
    const response = await Gestiono.v2GetPendingRecords({
      query: {
        type: 'ORDER',
        // @ts-expect-error - raw is not in the SDK types yet
        raw: "true",
        // @ts-expect-error - beneficiaryId is not in the SDK types yet
        beneficiaryId: String(contact.id),
      }
    })

    const records = response.items || []

    // Map records to a more friendly format for the frontend
    const tickets = await Promise.all(records.map(async (r) => {
      const record = await Gestiono.getPendingRecordById(r.id)
      // @ts-expect-error - metadata is not in the SDK types yet
      const ticketNumbers = record.elements?.map((el) => el.serialNumbers).flat() || []
      const elements = record.elements || []

      return {
        id: record.id,
        date: record.date,
        state: record.state,
        amount: record.amount,
        currency: record.currency,
        paid: record.paid,
        dueToPay: record.dueToPay,
        description: record.description,
        elements: elements.map((el) => ({
          description: el.description || el.resourceDescription || 'Boleto de rifa',
          quantity: el.quantity,
          price: el.price,
          resourceId: el.resourceId,
        })),
        ticketNumbers,
        metadata: {
          // @ts-expect-error - metadata is not in the SDK types yet
          name: record.metadata?.name,
          // @ts-expect-error - metadata is not in the SDK types yet
          status: record.metadata?.status,
          // @ts-expect-error - metadata is not in the SDK types yet
          submittedAt: record.metadata?.submittedAt,
        },
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        contact: {
          id: contact.id,
          name: contact.name,
        },
        tickets,
      }
    })
  } catch (error) {
    console.error('Error verifying tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Error al verificar los boletos' },
      { status: 500 }
    )
  }
}
