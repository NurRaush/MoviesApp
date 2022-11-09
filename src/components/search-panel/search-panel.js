import React from 'react'
import './search-panel.css'

export default class SearchPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }

  onLabelChange = (e) => {
    const { onSearchChange } = this.props
    onSearchChange(e.target.value)
    this.setState({ value: e.target.value })
  }

  render() {
    const { value } = this.state
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Type to search"
          className="search-input"
          value={value}
          onChange={this.onLabelChange}
        />
      </form>
    )
  }
}
