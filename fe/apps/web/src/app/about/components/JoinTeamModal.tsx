'use client'

import React, { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  Button
} from '@heroui/react'

interface JoinTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: ''
  })
  const [cvFile, setCvFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      if (!allowed.includes(file.type)) {
        alert('Chỉ chấp nhận file .pdf, .doc hoặc .docx')
        return
      }
      setCvFile(file)
    }
  }

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.position) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    if (!cvFile) {
      alert('Vui lòng tải lên CV của bạn.')
      return
    }
    // TODO handle this shit later
    console.log('Ứng viên gửi:', { ...formData, cvFile })
    onClose()
    alert('Cảm ơn bạn đã ứng tuyển! Chúng tôi sẽ sớm liên hệ.')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="p-2"
    >
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">
          Ứng tuyển làm thành viên Planggo
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            name="fullName"
            label="Họ và tên"
            placeholder="Nhập họ tên của bạn"
            value={formData.fullName}
            onChange={handleChange}
            isRequired
          />
          <Input
            name="email"
            label="Email"
            placeholder="Nhập email liên hệ"
            type="email"
            value={formData.email}
            onChange={handleChange}
            isRequired
          />
          <Input
            name="position"
            label="Vị trí mong muốn"
            placeholder="VD: Developer, Designer, Marketing..."
            value={formData.position}
            onChange={handleChange}
            isRequired
          />
          <div>
            <Input
              label="Tải lên CV của bạn"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              isRequired
            />
            {cvFile && (
              <p className="text-xs text-gray-500 italic">
                Đã chọn: {cvFile.name}
              </p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Gửi ứng tuyển
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
