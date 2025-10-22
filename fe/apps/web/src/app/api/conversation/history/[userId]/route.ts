import { CONVERSATION_API_URL } from '@/utils/constraints'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  context: RouteContext<'/api/conversation/history/[userId]'>
) => {
  const userId = (await context.params).userId
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page')
  const pageSize = searchParams.get('pageSize')
  const url = new URL(
    `${CONVERSATION_API_URL}/v1/conversation/history/${userId}`
  )
  const params = {
    page: page || '1',
    pageSize: pageSize || '10'
  }
  url.searchParams.append('page', params.page)
  url.searchParams.append('page_size', params.pageSize)

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return new NextResponse(resp.body, {
    headers: resp.headers,
    status: resp.status
  })
}
