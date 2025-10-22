import { Favourite } from '@/types/Favourite/favourite.type'
import { FAVOURITE_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1]

  if (!accessToken) {
    return NextResponse.json(
      { status: 'error', error: 'Access token not found' },
      { status: 401 }
    )
  }

  const uid = request.nextUrl.pathname.split('/').pop()
  if (!uid) {
    return NextResponse.json(
      { status: 'error', error: 'User ID not provided' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${FAVOURITE_API_URL}/${uid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', error: 'Get all favourite items failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const favouriteData: Favourite[] = data.data.data ?? []

    const { hotels, places } = favouriteClassify(favouriteData)

    // const [hotelDetails, placeDetails] = await Promise.all([
    //   fetchFavouriteDetails(hotels, 'hotel', accessToken),
    //   fetchFavouriteDetails(places, 'place', accessToken)
    // ])

    return NextResponse.json(
      {
        status: 'success',
        data: {
          hotels: hotels,
          places: places
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: (error as Error).message },
      { status: 500 }
    )
  }
}

const favouriteClassify = (data: Favourite[]) => {
  const hotels: Favourite[] = []
  const places: Favourite[] = []

  data.forEach((item) => {
    if (item.place_type === 'hotel') hotels.push(item)
    else if (item.place_type === 'place') places.push(item)
  })

  return { hotels, places }
}

// const fetchFavouriteDetails = async (
//   items: Favourite[],
//   type: 'hotel' | 'place',
//   token: string
// ) => {
//   const baseUrl = type === 'hotel' ? '/api/hotels/detail' : '/api/places'

//   const detailPromises = items.map(async (fav) => {
//     try {
//       const res = await fetch(`${baseUrl}/${fav.place_id}`, {
//         method: 'GET'
//       })

//       if (!res.ok) return null
//       const detail = await res.json()

//       return {
//         ...fav,
//         detail: detail.data ?? detail
//       }
//     } catch {
//       return null
//     }
//   })

//   const results = await Promise.all(detailPromises)
//   return results.filter((r): r is NonNullable<typeof r> => r !== null)
// }
