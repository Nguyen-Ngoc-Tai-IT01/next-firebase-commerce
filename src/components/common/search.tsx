'use client'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SearchBar = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')

  const onSubmitSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (keyword.trim()) {
      params.set('keyword', keyword.trim())
    } else {
      params.delete('keyword')
    }

    // navigate tới route mới để server component fetch lại dữ liệu
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        onKeyDown={e => {
          if (e.key === 'Enter') onSubmitSearch()
        }}
      />
    </div>
  )
}

export default SearchBar