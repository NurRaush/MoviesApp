import React from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Spin, Alert, Typography, Pagination, Tabs } from 'antd'
import { debounce } from 'lodash'

import TmdbService from '../../services/tmdb-service'
import MovieList from '../movie-list/movie-list'
import SearchPanel from '../search-panel/search-panel'
import { GenreProvider } from '../genre-context'

import './app.css'

const { Text } = Typography
export default class App extends React.Component {
  tmdb = new TmdbService()

  constructor(props) {
    super(props)
    this.state = {
      films: [],
      loading: false,
      error: false,
      errMessage: '',
      searchLabel: '',
      done: false,
      total: 0,
      curPage: 1,
      tabKey: 1,
    }
  }

  componentDidMount() {
    this.tmdb.createGuestSession().then((res) => {
      this.setState({ id: res.guest_session_id })
    })
    this.tmdb.getGenres().then((res) => {
      this.genres = res.genres
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchLabel, curPage, tabKey } = this.state
    const { searchLabel: prevSearch, curPage: prevCurPage } = prevState
    if (!searchLabel) {
      return
    }
    if (Number(tabKey) === 1) {
      if (prevSearch !== searchLabel || prevCurPage !== curPage) {
        this.setState({ loading: true })
        this.tmdb
          .getAllFilms(searchLabel, curPage)
          .then((res) => {
            this.setState({
              films: [...res.results],
              loading: false,
              error: false,
              done: true,
              total: res.total_results,
            })
          })
          .catch((err) => {
            this.setState({ loading: false, error: true, errMessage: err.message, done: true })
          })
      }
    } else if (Number(tabKey) === 2 && prevCurPage !== curPage) {
      const { id } = this.state
      this.tmdb
        .getRatedFilms(id)
        .then((res) => {
          this.setState({
            films: [...res.results],
            loading: false,
            error: false,
            done: true,
            curPage: 1,
            total: res.total_pages,
          })
        })
        .catch((err) => {
          this.setState({ loading: false, error: true, errMessage: err.message, done: true })
        })
    }
  }

  onPageChange = (page) => {
    this.setState({ curPage: page })
  }

  onSearchChange = debounce((label) => {
    this.setState({ searchLabel: label })
  }, 500)

  onTabsChange = (key) => {
    this.setState({ loading: true, tabKey: key })
    const { searchLabel, curPage } = this.state
    if (Number(key) === 1) {
      this.tmdb
        .getAllFilms(searchLabel, curPage)
        .then((res) => {
          this.setState({
            films: [...res.results],
            loading: false,
            error: false,
            done: true,
            total: res.total_results,
          })
        })
        .catch((err) => {
          this.setState({ loading: false, error: true, errMessage: err.message, done: true })
        })
    } else if (Number(key) === 2) {
      const { id } = this.state
      this.tmdb
        .getRatedFilms(id)
        .then((res) => {
          this.setState({
            films: [...res.results],
            loading: false,
            error: false,
            done: true,
            total: res.total_results,
          })
        })
        .catch((err) => {
          this.setState({ loading: false, error: true, errMessage: err.message, done: true })
        })
    }
  }

  render() {
    const { loading, error, errMessage, films, searchLabel, done, total, curPage, id } = this.state
    const notFound =
      films.length === 0 && done ? <Text>{`No results found for ${searchLabel}`}</Text> : false
    const spinner = loading ? (
      <div className="spinner">
        <Spin size="large" tip="loading" />
      </div>
    ) : (
      false
    )
    const errAlert = error ? <Alert message={errMessage} showIcon type="error" /> : false
    const tabItems = [
      {
        label: 'Search',
        key: '1',
        children: (
          <>
            <SearchPanel onSearchChange={this.onSearchChange} />
            {notFound || spinner || errAlert || (
              <MovieList className="movielist" films={films} guestId={id} />
            )}
            <div className="pagination">
              <Pagination
                current={curPage}
                onChange={this.onPageChange}
                total={total}
                hideOnSinglePage
              />
            </div>
          </>
        ),
      },
      {
        label: 'Rated',
        key: '2',
        children: (
          <>
            {notFound || spinner || errAlert || <MovieList films={films} />}

            <div className="pagination">
              <Pagination
                current={curPage}
                onChange={this.onPageChange}
                total={total}
                hideOnSinglePage
              />
            </div>
          </>
        ),
      },
    ]
    return (
      <>
        <Offline>You are offline right now. Check your connection.</Offline>
        <Online>
          <GenreProvider value={this.genres}>
            <Tabs onChange={this.onTabsChange} centered defaultActiveKey="1" items={tabItems} />
          </GenreProvider>
        </Online>
      </>
    )
  }
}
