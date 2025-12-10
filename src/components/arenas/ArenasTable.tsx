'use client'
import { Table, Rate } from 'antd'

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'City', dataIndex: 'city' },
  { title: '11v11', dataIndex: 'full' },
  { title: '7v7', dataIndex: 'seven' },
  { title: 'Rooms', dataIndex: 'rooms' },
  { title: 'Access', dataIndex: 'access' },
  {
    title: 'Rating',
    dataIndex: 'rating',
    render: (value: number) => <Rate disabled value={value} />,
  },
]

const data = Array.from({ length: 8 }).map((_, i) => ({
  key: i,
  name: 'Helenelunds IP',
  city: 'Sollentuna',
  full: 2,
  seven: 1,
  rooms: 9,
  access: 'Public',
  rating: 3,
}))

export default function ArenasTable() {
  return (
    <section className="p-4 bg-[#0B0F19] min-h-screen">
      <Table
        columns={columns}
        dataSource={data}
        className="custom-dark-table"
        bordered={false} // remove white borders
      />
    </section>
  )
}
