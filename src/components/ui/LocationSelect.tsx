import { useCallback, useMemo, useRef, useState } from 'react';
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { getLocations } from '@/features/homePage/homePageSlice';

const DEBOUNCE_MS = 300;

function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    }) as T,
    [delay],
  );
}

interface LocationSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
}

export function LocationSelect({
  value,
  onChange,
  placeholder = 'Type to search locations...',
  className,
  onBlur,
}: LocationSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { locationData } = useSelector((state: RootState) => state.homePage);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useCallback(
    (search: string) => {
      setLoading(true);
      dispatch(getLocations({ search }))
        .unwrap()
        .finally(() => setLoading(false));
    },
    [dispatch],
  );

  const debouncedFetch = useDebounce(fetchLocations, DEBOUNCE_MS);

  const handleSearch = useCallback(
    (search: string) => {
      debouncedFetch(search ?? '');
    },
    [debouncedFetch],
  );

  const handleDropdownVisibleChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchLocations('');
      }
    },
    [fetchLocations],
  );



  const options = useMemo(() => {
    const list = locationData ?? [];
    return list.map((item: any) => ({
      value: item?.id,
      label:  item.location ?? '',
    })).filter((o: { value: string; label: string }) => o.value !== '' && o.label !== '');
  }, [locationData]);

  return (
    <Select
      mode="multiple"
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={className}
      onBlur={onBlur}
      loading={loading}
      allowClear
      notFoundContent={loading ? 'Loading...' : 'Type to search locations'}
      style={{ width: '100%' }}
      size='large'
    />
  );
}
