import { NextResponse } from 'next/server'
import { Gestiono } from '@bitnation-dev/management/server'
import { Raffle } from '@/types/raffle'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '50'
    
    const resources = await Gestiono.v2GetResources({
      elementsPerPage: limit,
      page: page,
      labels: "rifa"
    })
    
    const raffles: Raffle[] = resources.items.map((resource) => {
      // Extract ticket information from metadata or use defaults
      const ticketPrice = resource.sellPrice || 0
      const totalTickets = resource.total.available || 0
      const soldTickets = 0
      
      // Calculate time left (you may need to adjust this based on your date fields)
      const endDate = resource.metadata?.endDate 
        ? new Date(resource.metadata.endDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days from now
      
      const now = new Date()
      const diffTime = endDate.getTime() - now.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const timeLeft = diffTime > 0 ? `${diffDays}d ${diffHours}h` : "Finalizada"
      
      // Check if featured (you may want to use a metadata field for this)
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
    
    return NextResponse.json({
      success: true,
      data: raffles,
      total: resources.totalItems,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(resources.totalItems / parseInt(limit))
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Error al cargar las rifas' },
      { status: 500 }
    )
  }
}

