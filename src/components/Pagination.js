import React from 'react';
import TablePagination from "@material-ui/core/TablePagination";

const Pagination = ({ page, results: { hits }, rowsPerPage, handleChangePage }) => (
    <TablePagination
        component="div"
        count={hits.total}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        page={page}
        onChangePage={handleChangePage}
    />
);

export default Pagination;