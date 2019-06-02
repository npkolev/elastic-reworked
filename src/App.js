import React, { PureComponent, Fragment } from "react";
import { isNil } from "ramda";
import { react as autoBind } from "auto-bind";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Pagination from "./components/Pagination";
import SearchInput from "./components/SearchInput";
import CardResult from "./components/CardResult";
import { getQuery } from './api/getQuery';
import "./index.css";

class App extends PureComponent {
  state = {
    results: {},
    value: "",
    page: 0,
    currentPage: 0,
    rowsPerPage: 10,
    lastScore: "",
    lastId: ""
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  buildQuery(query, filterProps) {
    return {
      size: 10,
      from: 0,
      query: {
        query_string: {
          query: query
        }
      },
      highlight: {
        fields: {
          "*": {}
        },
        number_of_fragments: 0,
        tags_schema: "styled"
      },
      ...filterProps
    };
  }

  async baseQuery(query) {
    const filterProps = {
      sort: [{ _score: "desc" }, { _id: "desc" }]
    }
    const queryObj = this.buildQuery(query, filterProps);
    const data = await getQuery(queryObj);
    this.setState({ results: data });
  }

  triggerSearch({ target: { value } }) {
    this.baseQuery(value);
    this.setState({
      value: value
    });
  }

  callBaseSearch(value) {
    this.baseQuery(value);
  }

  async handleChangePage(e, page) {
    const { currentPage, value, results: { hits: { hits = {} } } = {} } = this.state;
    const isTruthy = currentPage < page;

    if (currentPage === page) {
      this.setState({ page });
      return this.callBaseSearch(value);
    }

    const searchAfterNext = hits[hits.length - 1]
      ? hits[hits.length - 1].sort
      : [];

    const reversedHits = !isTruthy && hits.reverse();
    const searchAfterPrev =
      !isTruthy && reversedHits[0] ? reversedHits[0].sort : [];

    const filterProps = {
      search_after: isTruthy ? searchAfterNext : searchAfterPrev,
      sort: [
        { _score: isTruthy ? "desc" : "asc" },
        { _id: isTruthy ? "desc" : "asc" }
      ]
    }
    const query = this.buildQuery(value, filterProps);
    const data = await getQuery(query);
    this.setState({ page: page, currentPage: page, results: data });
  }

  clearInput() {
    this.setState({
      value: "",
      results: {}
    });
  }

  render() {
    const { value, results: { hits } = {} } = this.state;

    return (
      <Fragment>
        <div className="root">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Search App
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <Grid container className="root">
          <Grid className="grid-padding" item xs={12}>
            <Grid
              container
              spacing={16}
              className="demo"
              alignItems="center"
              direction="column"
              justify="center"
            >
              <Paper className="search-root" elevation={1}>
                <SearchInput triggerSearch={this.triggerSearch} value={value} />
                <IconButton className="icon-button" aria-label="Search">
                  <SearchIcon />
                </IconButton>
              </Paper>
              <Button
                variant="contained"
                color="primary"
                onClick={this.clearInput}
              >
                Clear
              </Button>
            </Grid>
            <Grid
              container
              spacing={16}
              alignItems="stretch"
              direction="column"
              justify="center"
            >
              {!isNil(hits) && hits.hits.map(
                ({
                  _id,
                  _source,
                  highlight
                }) => <CardResult key={_id} _source={_source} highlight={highlight} />
              )
              }
              <Grid
                container
                spacing={16}
                alignItems="stretch"
                direction="row"
                justify="center"
              >
                {!isNil(hits) && hits.total > 0 && (
                  <Pagination {...this.state} handleChangePage={this.handleChangePage} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default App;