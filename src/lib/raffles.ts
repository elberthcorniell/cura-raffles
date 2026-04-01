import { Gestiono } from '@bitnation-dev/management/server'
import { Raffle } from '@/types/raffle'

/**
 * Fetches raffles from the API (server-side only)
 */
export async function fetchRaffles(options?: { page?: number; limit?: number }): Promise<{
  raffles: Raffle[]
  total: number
}> {
  const page = options?.page?.toString() || '1'
  const limit = options?.limit?.toString() || '50'

  try {
    const resources = await Gestiono.v2GetResources({
      elementsPerPage: limit,
      page: page,
      labels: "rifa"
    })

    const raffles: Raffle[] = resources.items.map((resource) => {
      const ticketPrice = resource.sellPrice || 0
      const totalTickets = resource.total.available || 0
      const soldTickets = 0

      const endDate = resource.metadata?.endDate
        ? new Date(resource.metadata.endDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const now = new Date()
      const diffTime = endDate.getTime() - now.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const timeLeft = diffTime > 0 ? `${diffDays}d ${diffHours}h` : "Finalizada"

      const featured = resource.metadata?.featured === true || false

      return {
        id: typeof resource.id === 'number' ? resource.id : parseInt(String(resource.id), 10),
        title: resource.name || "Rifa sin título",
        description: resource.description || "Participa en esta increíble rifa y gana premios increíbles.",
        ticketPrice: ticketPrice,
        totalTickets: totalTickets,
        soldTickets: soldTickets,
        timeLeft: timeLeft,
        image: resource.multimedia?.[0]?.url || "/placeholder.svg",
        featured: featured
      }
    })

    return {
      raffles,
      total: resources.totalItems
    }
  } catch (error) {
    console.error('Error fetching raffles:', error)
    return {
      raffles: [],
      total: 0
    }
  }
}

/**
 * Fetches the first/featured raffle for metadata
 */
export async function fetchFirstRaffle(): Promise<Raffle | null> {
  const { raffles } = await fetchRaffles({ page: 1, limit: 1 })
  return raffles[0] || null
}
