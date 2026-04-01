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
  "838198075": {
    bank: "Banco Popular",
    accountType: "Cuenta corriente",
    holderName: "Manny Cristobal Mora Peña",
    cedula: "402-3521285-5",
  },
  "9609044946": {
    bank: "Banreservas",
    accountType: "Cuenta de ahorros",
    holderName: "Manny Cristóbal Mora Peña",
    cedula: "402-3521285-5",
  },
  "25582850030": {
    bank: "BHD León",
    accountType: "Cuenta de ahorros",
    holderName: "JHAN SANTANA",
    cedula: "402-2580124-6",
  },
  "1133-2010022-826": {
    bank: "Banco Santa Cruz",
    accountType: "Cuenta de ahorros",
    holderName: "William José Sánchez",
    cedula: "402-2544985-5",
  },
  "786-960-2794": {
    bank: "Zelle",
    accountType: "Zelle",
    holderName: "Yunior García",
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
