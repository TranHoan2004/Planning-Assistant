import 'server-only'

const apiKey = process.env.RAPIDAPI_KEY!

const baseUrl = "https://booking-com15.p.rapidapi.com/api/v1"

const baseHeaders = {
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    'x-rapidapi-key': apiKey
}

export const getHotelDetails = async (hotelId: string, checkInDate: string, checkOutDate: string) => {
    const url = new URL(`${baseUrl}/hotels/getHotelDetails`)
    url.searchParams.append('hotel_id', hotelId)
    url.searchParams.append('arrival_date', checkInDate)
    url.searchParams.append('departure_date', checkOutDate)

    const response = await fetch(url, {
        headers: baseHeaders
    })

    if (!response.ok) {
        throw new Error('Failed to fetch hotel details')
    }

    return response.json()
}
