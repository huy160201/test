import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Button, Form, Input, Select, Skeleton, Space } from 'antd'
import { notificationError, notificationSuccess } from '@/helpers/notification'
import { Category, CategoryPayload } from '@/types/category'
import { NextPageWithLayout } from '@/types/next-page'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { CategoryService } from '@/services/category'

import User from '@/components/layouts/user'

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const categoryID = router.query.id
  const [category, setCategory] = useState<Category>()
  const [loading, setLoading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [payload, setPayload] = useState<CategoryPayload>({
    name: category?.name,
    description: category?.description,
    status: category?.status
  })

  const fetchCategoryByID = async () => {
    try {
      setLoading(true)
      const response = await CategoryService.show(categoryID)
      if (response) setCategory(response)
    } catch {
      notificationError('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async () => {
    try {
      setSubmitLoading(true)
      if (await CategoryService.update(categoryID, payload))
        notificationSuccess('Cập nhật danh mục thành công!')
    } catch {
      notificationError('Có lỗi xảy ra')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (categoryID) fetchCategoryByID()
  }, [router])

  return (
    <div
      style={{
        margin: '10px 20px',
        background: '#fff',
        padding: '10px 10px',
        borderRadius: '6px'
      }}
    >
      <div
        style={{
          color: '#1677FF',
          margin: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingBottom: '1rem',
          borderBottomColor: '#F5F5F5',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          fontSize: '0.9rem',
          fontFamily: 'sans-serif'
        }}
      >
        <MenuUnfoldOutlined />
        <div>Cập nhật danh mục #{category?.id}</div>
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <Form
          style={{ marginLeft: '1rem' }}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Tên danh mục:"
            style={{ width: '50%' }}
            name="category_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input
              defaultValue={category?.name}
              onChange={e => setPayload({ ...payload, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Mô tả:" style={{ width: '50%' }}>
            <Input
              defaultValue={category?.description}
              onChange={e =>
                setPayload({ ...payload, description: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Trạng thái:" style={{ width: '10rem' }}>
            <Select
              defaultValue={category?.status}
              options={[
                { value: 1, label: 'Hoạt động' },
                { value: 0, label: 'Không hoạt động' }
              ]}
              onChange={value => setPayload({ ...payload, status: value })}
            />
          </Form.Item>

          <Space>
            <Button onClick={() => router.push('/users/category')}>
              Quay lại
            </Button>
            <Button
              style={{ background: '#0080FF', color: 'white' }}
              type="text"
              onClick={onUpdate}
              loading={submitLoading}
            >
              Cập nhật
            </Button>
          </Space>
        </Form>
      )}
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <User>{page}</User>
}

export default Page
