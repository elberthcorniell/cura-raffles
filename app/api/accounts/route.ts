import { NextResponse } from 'next/server'
import { Gestiono } from '@bitnation-dev/management/server'

export interface BankAccount {
  id: number
  name: string
  bank: string
  accountNumber: string
  accountType: string
  currency: string
  holderName?: string
  cedula?: string
}

const enrichedData: Record<string, { bank: string; accountType: string; holderName?: string; cedula?: string }> = {
  "40099180013": {
    bank: "Banco BHD",
    accountType: "Cuenta de ahorros",
    holderName: "Adilssa Santos",
  },
  "836405746": {
    bank: "Banco Popular",
    accountType: "Cuenta corriente",
    holderName: "Adilssa Santos",
  },
  "9607543272": {
    bank: "Banreservas",
    accountType: "Cuenta corriente",
    holderName: "Adilssa Santos",
  },
  "1000612991": {
    bank: "Qik",
    accountType: "Cuenta de ahorros",
    holderName: "Adilssa Santos",
  },
  "https://www.paypal.me/adilssasantos": {
    bank: "PayPal",
    accountType: "PayPal",
    holderName: "Adilssa Santos",
  },
  "100100256895": {
    bank: "Asociación Cibao",
    accountType: "Cuenta de ahorros",
    holderName: "Adilssa Santos",
  },
}

export async function GET() {
  try {
    // @ts-expect-error
    const accounts: {
      id: number
      name: string
      bank: string
      accountNumber: string
      type: string
      currency: string
    }[] = await Gestiono.getAccounts()

    const filteredAccounts = accounts.filter((account) => !!account.accountNumber)

    

    const bankAccounts: BankAccount[] = filteredAccounts.map((account) => {
      const enriched = enrichedData[account.accountNumber] || {
        bank: '',
        accountType: '',
        holderName: '',
        cedula: '',
      }
      return {
        id: account.id,
        name: account.name || '',
        bank: enriched.bank || '',
        accountNumber: account.accountNumber || '',
        accountType: enriched.accountType || '',
        currency: account.currency || 'DOP',
        holderName: enriched.holderName,
        cedula: enriched.cedula,
      }
    })

    return NextResponse.json({
      success: true,
      data: bankAccounts,
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cargar las cuentas bancarias' },
      { status: 500 }
    )
  }
}
