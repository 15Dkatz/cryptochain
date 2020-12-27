import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Block from './Block';
import io from 'socket.io-client';
import Header from './Header';

class Blocks extends Component {
  state = { blocks: [], paginetedId: 1, blocksLength: 0 };

  fetchBlockchain = () => {
    fetch(`${document.location.origin}/api/blocks/length`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    })
    .then(json => this.setState({ blocksLength: json }))
    .catch(err => alert(err.message));
    this.fetchPaginatedBlocks(this.state.paginetedId)();
  }

  fetchPaginatedBlocks = id => () => {
    fetch(`${document.location.origin}/api/blocks/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    })
    .then(json => this.setState({ blocks: json }))
    .catch(err => alert(err.message));
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('sync', () => {
      this.fetchBlockchain();
    });
    this.fetchBlockchain();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div>
        <Header />
        <div><Link to='/dashboard'>Dashboard</Link></div>
        <h3>Blocks</h3>
        <div>
          {
            [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key => {
              const paginetedId = key+1;
              return (
                <span key={key} onClick={this.fetchPaginatedBlocks(paginetedId)}>
                  <Button
                    variant='info'
                    size='sm'
                  >{paginetedId}</Button>{' '}
                </span>
              )
            })
          }
        </div>
        {
          this.state.blocks.map(block => <Block key={block.hash} block={block} />)
        }
      </div>
    );
  }
}

export default Blocks;
