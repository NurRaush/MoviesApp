import { Col, Row, Card, Image, Typography, Rate, Tag } from 'antd'

import TmdbService from '../../services/tmdb-service'
import { GenreConsumer } from '../genre-context'
import './film.css'

const { Text, Title } = Typography

function Film(props) {
  const tmdb = new TmdbService()
  const { pic, date, description, vote, originalTitle, id, rateValue = 0, guestId, genres } = props
  let picPath = pic
  const voteBorder =
    vote < 3 ? 'bad-rate' : vote < 5 ? 'low-rate' : vote < 7 ? 'mid-rate' : 'high-rate'
  const onRateChange = (value) => {
    tmdb.rateFilm(id, value, guestId)
  }

  if (!picPath) {
    if (window.innerWidth <= 768) {
      picPath = 'http://dummyimage.com/60x91'
    } else {
      picPath = 'http://dummyimage.com/183x281'
    }
  }

  const genreArr = (
    <GenreConsumer>
      {(genresContainer) => {
        const genreNames = genres.map((elem) => {
          const result = genresContainer.find((item) => item.id === elem)
          return result
        })
        const result = genreNames.map((elem) => <Tag key={elem.id}>{elem.name}</Tag>)
        return result
      }}
    </GenreConsumer>
  )
  return (
    <Card bordered bodyStyle={{ padding: '0' }} className="card">
      <Row gutter={[{ xs: 13, md: 20 }, { xs: 10 }]}>
        <Col xs={4} md={8}>
          <Image src={picPath} />
        </Col>
        <Col xs={20} md={16} className="card-info">
          <div className="card-title">
            <Title level={4} className="title">
              {originalTitle}
            </Title>
            <div className={`card-vote ${voteBorder}`}>{vote.toFixed(1)}</div>
          </div>
          <Text type="secondary">{date}</Text>
          <div>{genreArr}</div>
          {window.innerWidth >= 768 && (
            <>
              <Text className="card-description">{description}</Text>
              <Rate allowHalf count={10} onChange={onRateChange} defaultValue={rateValue} />
            </>
          )}
        </Col>
        {window.innerWidth < 768 && (
          <>
            <Col xs={24}>
              <Text className="card-description">{description}</Text>
            </Col>
            <Col xs={24}>
              <Rate
                className="rate"
                allowHalf
                count={10}
                onChange={onRateChange}
                defaultValue={rateValue}
              />
            </Col>
          </>
        )}
      </Row>
    </Card>
  )
}

export default Film
