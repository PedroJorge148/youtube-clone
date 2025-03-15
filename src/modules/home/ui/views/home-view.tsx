import { CategoriesSection } from '../sections/categories-section'

interface HomeViewProps {
  categoryId?: string
}

export function HomeView({ categoryId }: HomeViewProps) {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-6">
      <CategoriesSection categoryId={categoryId} />
    </div>
  )
}
