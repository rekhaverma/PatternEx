import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

import { AdvanceSelect } from 'components/advance-select';

import { sizePerPageTable } from '../../constants';

export const Pagination = (props) => {
  const {
    dataSize,
    pageSize,
    className,
    onPageSelectHandler,
    onPageSizeChange,
    currentPage,
  } = props;
  const pagesNumber = Math.floor(dataSize / Number(pageSize));
  const pageCount = dataSize % Number(pageSize) === 0 ? pagesNumber : pagesNumber + 1;

  return (
    <div className={`${className}__pagination`}>
      <AdvanceSelect
        options={sizePerPageTable}
        activeOption={pageSize}
        onOptionUpdate={onPageSizeChange}
      />

      {dataSize > pageSize && (
        <ReactPaginate
          previousClassName="hidden"
          nextClassName="hidden"
          breakClassName="break-me"
          forcePage={currentPage}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={onPageSelectHandler}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      )}
    </div>
  );
};

Pagination.propTypes = {
  onPageSizeChange: PropTypes.func.isRequired,
  onPageSelectHandler: PropTypes.func.isRequired,
  pageSize: PropTypes.string.isRequired,
  dataSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Pagination.defaultProps = {
  className: 'smart-table',
};
