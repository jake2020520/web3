'use client';

import FilterCarousel from '@/components/filter-carousel';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const CategoriesSection = ({ categoryId }: { categoryId?: string }) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions(),
  );
  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set('categoryId', value);
    } else {
      url.searchParams.delete('categoryId');
    }

    router.push(url.toString());
  };
  return <FilterCarousel data={data} onSelect={onSelect} value={categoryId} />;
};

export default CategoriesSection;
