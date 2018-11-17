import React, { Component } from 'react';

class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch('http://localhost:3000/api/blocks')
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }));
  }

  render() {
    console.log('this.state', this.state);
      
    return (
      <div>
        <h3>Blocks</h3>
        {
          this.state.blocks.map(block => {
            return (
              <div key={block.hash}>{block.hash}</div>
            )
          })
        }
      </div>
    );
  }
}

export default Blocks;