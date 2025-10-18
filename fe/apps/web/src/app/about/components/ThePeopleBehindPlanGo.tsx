'use client'

import React, { useState } from 'react'
import { Button, Tooltip } from '@heroui/react'
import { JoinTeamModal } from '@/app/about/components/JoinTeamModal'

interface TeamMemberCardProps {
  image: string
  name: string
  title: string
  bio: string
  socials: { [key: string]: string }
  description?: string
  index: number
}

const colors: (
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'default'
  | 'foreground'
  | 'danger'
  | undefined
)[] = [
  'primary',
  'secondary',
  'warning',
  'success',
  'danger',
  'default',
  'foreground',
  undefined
]

const TEAM_MEMBERS = [
  {
    image: 'our-team/KhanhNT.png',
    name: 'Nguyễn Tuấn Khanh',
    title: 'PM & Developer & CEO',
    bio: 'Điều phối chiến lược và phát triển kinh doanh; đồng thời tham gia phát triển product và tích hợp kỹ thuật để đảm bảo tính khả thi thị trường.',
    socials: { twitter: '#', linkedin: '#', email: '#' },
    description: 'A dep zai, a co quyen'
  },
  {
    image: 'our-team/MaiHH.png',
    name: 'Mai Huy Hoàng',
    title: 'Founder / CTO',
    bio: 'Kiến trúc sư hệ thống và AI; chịu trách nhiệm tầm nhìn kỹ thuật, nền tảng backend và tích hợp mô-đun tối ưu hóa giá/đặt chỗ.',
    socials: { twitter: '#', linkedin: '#', email: '#' },
    description: 'Ông vua ngành code, nhạc nào cũng nhảy được'
  },
  {
    image: 'our-team/AnhDH.png',
    name: 'Đỗ Hoàng Anh',
    title: 'Developer & UI/UX',
    bio: 'Quản lý timeline dự án, kết nối giữa dev & marketing; thiết kế UX tập trung vào trải nghiệm cá nhân hóa và chuyển đổi người dùng.',
    socials: { twitter: '#', linkedin: '#', email: '#' },
    description: 'Devsigner ...'
  },
  {
    image: 'our-team/BacVX.png',
    name: 'Vũ Xuân Bắc',
    title: 'Head of Engineering',
    bio: 'Chuyên gia backend và hệ thống phân tán; đảm bảo hiệu năng, độ sẵn sàng và quy trình vận hành cho trải nghiệm đặt chỗ mượt mà.',
    description:
      'Dedicated backend developer - preferably before my coffee kicks in!'
  },
  {
    image: 'our-team/HueNN.jpg',
    name: 'Nguyễn Ngọc Huế',
    title: 'CMO',
    bio: 'Phát triển chiến lược go-to-market và tăng trưởng người dùng; tối ưu hóa acquisition, brand và thông điệp cá nhân hoá cho từng phân khúc.',
    description: '😃 Mình chill theo cách riêng của mình.'
  },
  {
    image: 'our-team/HoanTX.png',
    name: 'Trần Xuân Hoàn',
    title: 'Developer',
    bio: 'Thực thi tính năng, sửa lỗi và đảm bảo chất lượng mã; tập trung vào trải nghiệm người dùng và tích hợp API thanh toán/đặt chỗ.',
    description: 'Nếu có chết, hãy chôn tôi tại phòng server của Planggo'
  }
]

const TeamMemberCard = ({
  image,
  name,
  title,
  bio,
  socials,
  description,
  index
}: TeamMemberCardProps) => (
  <Tooltip content={description} color={colors[index]} placement={'top'}>
    <div className="bg-white p-6 rounded-lg shadow-lg relative shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out text-center h-full">
      {/* Avatar */}
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white"
      />

      <h4 className="text-xl font-bold text-gray-900">{name}</h4>
      <p className="text-sm text-indigo-600 mb-4">{title}</p>

      {/* Bio */}
      <p className="text-xs text-gray-600 min-h-[48px] mb-4">
        {bio || 'Detailed biography coming soon.'}
      </p>

      {/* Social Icons (Placeholder) */}
      <div className="flex justify-center space-x-3 text-gray-400 text-lg">
        {socials.twitter && <span>T</span>}
        {socials.linkedin && <span>L</span>}
        {socials.email && <span>E</span>}
      </div>
    </div>
  </Tooltip>
)

export const ThePeopleBehindPlanGo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <p className="uppercase text-sm text-gray-500 font-semibold mb-2 tracking-widest">
          Meet The Team
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          The People Behind PlanGo
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Our diverse team of travel enthusiasts, technologists, and dreamers
          working to make travel accessible for everyone.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, key) => (
            <TeamMemberCard
              key={member.name}
              {...member}
              index={key}
              socials={{ twitter: '#', linkedin: '#', email: '#' }}
            />
          ))}
        </div>

        <Tooltip
          content="Let's become a member of Planggo!"
          color={'warning'}
          placement={'right'}
        >
          <Button
            className="mt-12 bg-indigo-600 text-white font-semibold py-3 px-10 rounded-full hover:bg-indigo-700 transition duration-300"
            onPress={() => setIsModalOpen(true)}
          >
            Join Our Team
          </Button>
        </Tooltip>
        <JoinTeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  )
}
