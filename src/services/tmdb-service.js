export default class TmdbService {
  apiBase = 'https://api.themoviedb.org/3/'

  apiKey = '?api_key=fbc23322a60746beaa0965b4ad46ec57'

  async getResource(url, name = '', page = 1) {
    let res
    try {
      res = await fetch(`${this.apiBase}${url}${this.apiKey}&query=${name}&page=${page}`)
    } catch (e) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    const result = await res.json()
    return result
  }

  async postResource(url, body, guestId) {
    fetch(`${this.apiBase}${url}${this.apiKey}&guest_session_id=${guestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    })
  }

  async getAllFilms(name, page) {
    const res = await this.getResource('search/movie', name, page)
    return res
  }

  async createGuestSession() {
    const res = await this.getResource('authentication/guest_session/new')
    return res
  }

  async rateFilm(id, value, guestId) {
    this.postResource(`movie/${id}/rating`, { value }, guestId)
  }

  async getRatedFilms(id) {
    const res = await this.getResource(`guest_session/${id}/rated/movies`)
    return res
  }

  async getGenres() {
    const res = await this.getResource('genre/movie/list')
    return res
  }
}
