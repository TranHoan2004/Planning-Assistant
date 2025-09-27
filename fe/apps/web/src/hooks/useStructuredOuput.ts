import React, { useState } from 'react'
import z from 'zod'

const useStructuredOuput = <T extends z.ZodType>(dataType: T) => {
  const [data, setData] = useState<z.infer<T> | undefined>(undefined)

  return {
    data,
    setData
  }
}

export default useStructuredOuput
