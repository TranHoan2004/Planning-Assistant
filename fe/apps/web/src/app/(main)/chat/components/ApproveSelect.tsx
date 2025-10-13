'use client'

import React from 'react'
import { Button } from '@heroui/button'
import { useTranslations } from 'next-intl'

interface ApproveSelectProps {
  label: string
  onYes: () => void
  onNo: () => void
}

const ApproveSelect = ({ label, onYes, onNo }: ApproveSelectProps) => {
  const t = useTranslations('ChatPage.approve-select')

  return (
    <div className="bg-neutral-100 px-4 py-3 rounded-2xl mt-3">
      <span className="font-semibold w-full">{label}</span>
      <div className="flex gap-2 items-center justify-end mt-2">
        <Button
          variant="solid"
          className="bg-gradient-to-r from-[#F65555] to-[#FFB26A] text-white"
          onPress={onYes}
        >
          {t('yes')}
        </Button>
        <Button variant="bordered" onPress={onNo}>
          {t('no')}
        </Button>
      </div>
    </div>
  )
}

export default ApproveSelect
