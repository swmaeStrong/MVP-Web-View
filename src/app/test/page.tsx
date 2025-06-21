'use client';

import ErrorState from '@/components/common/ErrorState';
import NoData from '@/components/common/NoData';

const TestPage = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-white'>
      <ErrorState
        title='오류가 발생했습니다'
        message='문제가 발생했습니다. 다시 시도해주세요.'
        className='relative'
        size='lg'
      />
      <NoData
        title='데이터가 없습니다'
        message='표시할 데이터가 없습니다.'
        size='sm'
      />
    </div>
  );
};

export default TestPage;
