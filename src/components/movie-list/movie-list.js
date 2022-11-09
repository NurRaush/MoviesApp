import React from 'react'
import { format } from 'date-fns'
import { Col, Row } from 'antd'

import Film from '../film'

import './movie-list.css'

function MovieList({ films, guestId }) {
  const stringCut = (str) => {
    const result = `${str.split(' ').slice(0, 20).join(' ')}...`
    return result
  }

  const getMoviesList = () => {
    const page = films.map((elem) => {
      const genres = elem.genre_ids
      let date = '-'
      let pic = ''
      const description = stringCut(elem.overview)
      const originalTitle = elem.original_title
      let vote = 0
      if (elem.release_date && elem.release_date.length > 5) {
        date = format(new Date(elem.release_date), 'MMMM d, yyyy')
      }
      if (elem.poster_path) {
        pic = `https://image.tmdb.org/t/p/original${elem.poster_path}`
      }
      if (elem.vote_average) {
        vote = elem.vote_average
      }

      return (
        <Col xs={24} md={12} key={elem.id}>
          <Film
            vote={vote}
            date={date}
            pic={pic}
            description={description}
            originalTitle={originalTitle}
            id={elem.id}
            guestId={guestId}
            rateValue={elem.rating}
            genres={genres}
          />
        </Col>
      )
    })
    return page
  }
  let allPage
  if (films.length !== 0) {
    allPage = getMoviesList()
  }

  return (
    <Row gutter={[36, 36]} justify="space-between">
      {allPage}
    </Row>
  )
}

export default MovieList
