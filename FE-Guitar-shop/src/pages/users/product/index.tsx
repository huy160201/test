import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MenuUnfoldOutlined,
  MonitorOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Button, Input, Select, Space } from 'antd'
import { ListPayload, Product } from '@/types/product'
import { NextPageWithLayout } from '@/types/next-page'
import { notificationError } from '@/helpers/notification'
import { defaultPagination } from '@/configs/pagination'
import { ProductService } from '@/services/product'

import User from '@/components/layouts/user'
import Products from '@/components/products'
import CategorySelect from '@/components/utilities/categorySelect'

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[] | undefined>()

  const [total, setTotal] = useState<number>(defaultPagination.total)
  const [page, setPage] = useState<number>(defaultPagination.page)
  const [pageSize, setPageSize] = useState<number>(defaultPagination.size)

  const [search, setSearch] = useState<string>()
  const [categoryID, setCategoryID] = useState<number>(-1)
  const [status, setStatus] = useState<number>(-1)
  const [sortString, setSortString] = useState<string>('desc')
  const [sortField, setSortField] = useState<string>('created_at')

  const [loading, setLoading] = useState<boolean>(false)

  const getCurrentPage = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const payload: ListPayload = {
        page: page,
        pageSize: pageSize,
        name: search,
        categoryID: categoryID,
        status: status,
        sortField: sortField,
        sortOrder: sortString
      }
      const response = await ProductService.getList(payload)
      if (response) {
        setProducts(response.products)
        setTotal(response.total)
        setPage(response.page)
      }
    } catch {
      notificationError('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, pageSize])

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
        <div>Danh sách sản phẩm</div>
      </div>
      {/* Create new */}
      <div>
        <Button
          style={{
            marginBottom: '1rem',
            marginLeft: '1rem',
            background: '#1677FF',
            color: 'white'
          }}
          onClick={() => router.push('/users/product/create')}
        >
          <PlusOutlined />
          Thêm mới
        </Button>
      </div>
      {/* Sort filter */}
      <div style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
        <Space>
          <Select
            defaultValue="created_at"
            style={{ width: '150px' }}
            options={[
              { value: 'created_at', label: 'Ngày tạo' },
              { value: 'price', label: 'Giá' },
              { value: 'amount', label: 'Số lượng còn' }
            ]}
            status="error"
            onChange={value => setSortField(value)}
          />
          {sortString === 'desc' ? (
            <Button
              style={{ background: '#1677FF', color: 'white' }}
              onClick={() => setSortString('asc')}
            >
              <ArrowDownOutlined />
              Giảm dần
            </Button>
          ) : (
            <Button type="primary" onClick={() => setSortString('desc')}>
              <ArrowUpOutlined />
              Tăng dần
            </Button>
          )}
        </Space>
      </div>
      {/* Select and text filter */}
      <Space style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
        <CategorySelect onSelect={setCategoryID} categoryID={categoryID} />
        <Select
          defaultValue={-1}
          style={{ width: '150px' }}
          options={[
            { value: -1, label: '--- Trạng thái ---' },
            { value: 0, label: 'Không hoạt động' },
            { value: 1, label: 'Hoạt động' }
          ]}
          status="error"
          onChange={value => setStatus(value)}
        />
        <Input
          placeholder="Nhập tên sản phẩm"
          onBlur={e => setSearch(e.target.value)}
        />
        <Button type="primary" onClick={fetchProducts}>
          <MonitorOutlined /> Lọc
        </Button>
      </Space>
      <div>
        <Products
          products={products}
          pageSize={pageSize}
          total={total}
          loading={loading}
          onChange={getCurrentPage}
        />
      </div>
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <User>{page}</User>
}

export default Page
