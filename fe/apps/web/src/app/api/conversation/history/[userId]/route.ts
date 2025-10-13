import { CONVERSATION_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const userId = request.nextUrl.pathname.at(-1)
  const searchParams = new URLSearchParams(request.url)
  const page = searchParams.get('page')
  const pageSize = searchParams.get('pageSize')
  const url = new URL(
    `${CONVERSATION_API_URL}/v1/conversation/history/${userId}?`
  )
  const params = {
    page: page || '1',
    page_size: pageSize || '10'
  }
  url.search = new URLSearchParams(params).toString()

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return new NextResponse(resp.body, {
    headers: {
      ...resp?.headers
    }
  })
}
