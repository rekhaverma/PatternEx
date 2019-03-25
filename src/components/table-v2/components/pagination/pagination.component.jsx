import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactPaginate from 'react-paginate';
import SelectBox from 'components/select-box';

import './pagination.style.scss';

const sizePerPageTable = [{
  'content': '5 results',
  'id': '5',
}, {
  'content': '10 results',
  'id': '10',
}, {
  'content': '20 results',
  'id': '20',
}, {
  'content': '50 results',
  'id': '50',
}, {
  'content': '75 results',
  'id': '75',
}, {
  'content': '100 results',
  'id': '100',
}];

class Pagination extends Component {
  constructor(...args) {
    super(...args);

    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handleSizeChange(value) {
    this.props.onPageSizeChange(value);
  }

  handlePageClick(value) {
    this.props.onPageSelectHandler(value);
  }

  render() {
    const { dataSize, pageSize } = this.props;
    const pagesNumber = Math.floor(dataSize / Number(pageSize));
    const pageCount = dataSize % Number(pageSize) === 0 ? pagesNumber : pagesNumber + 1;

    return (
      <div className="pagination">
        <SelectBox
          singleSelect
          activeOption={this.props.pageSize}
          options={sizePerPageTable}
          placeholder="Show Results"
          style={{ 'marginRight': 20 }}
          onClick={this.handleSizeChange}
        />
        <ReactPaginate
          previousLabel=""
          nextLabel=""
          breakClassName="break-me"
          forcePage={this.props.currentPage}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={this.handlePageClick}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </div>
    );
  }
}

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  'onPageSizeChange': PropTypes.func.isRequired,
  'onPageSelectHandler': PropTypes.func.isRequired,
  'pageSize': PropTypes.string.isRequired,
  'dataSize': PropTypes.number.isRequired,
  'currentPage': PropTypes.number.isRequired,
};

export default Pagination;
