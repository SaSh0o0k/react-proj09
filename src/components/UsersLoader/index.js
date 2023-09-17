import React, { Component } from 'react';
import styles from './index.module.scss';

class UsersLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: false,
      page: 1,
      isError: false,
      selectedNationality: 'ua',
    }

    this.nationalities = [
      { code: 'ua', label: 'Ukraine' },
      { code: 'us', label: 'United States' },
      { code: 'gb', label: 'United Kingdom' },
      { code: 'au', label: 'Australia' },
      { code: 'br', label: 'Brazil' },
      { code: 'ca', label: 'Canada' },
      { code: 'ch', label: 'Switzerland' },
      { code: 'de', label: 'Germany' },
      { code: 'dk', label: 'Denmark' },
      { code: 'es', label: 'Spain' },
      { code: 'fi', label: 'Finland' },
      { code: 'fr', label: 'France' },
      { code: 'ie', label: 'Ireland' },
      { code: 'ir', label: 'Iran' },
      { code: 'nl', label: 'Netherlands' },
      { code: 'nz', label: 'New Zealand' },
      { code: 'tr', label: 'Turkey' },
    ];
    // console.log('constructor');
  }

  componentDidMount() {
    // console.log('componentDidMount');
    this.loadUsers();
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate');
    // console.log('prev page: ', prevState);
    // console.log('current page: ', this.state);
    if (this.state.page !== prevState.page || this.state.selectedNationality !== prevState.selectedNationality) {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.setState({ isLoading: true });

    const { page, selectedNationality } = this.state;

    fetch(`https://randomuser.me/api/?results=10&nat=${selectedNationality}&seed=foobar&page=${page}`)
      .then(response => response.json())
      .then(data => this.setState({
        users: data.results,
      }))
      .catch(error => this.setState({
        isError: true,
      }))
      .finally(() => this.setState({
        isLoading: false
      }));
  }

  prevPage = () => {
    this.setState({ page: this.state.page - 1 })
  }
  nextPage = () => {
    this.setState({ page: this.state.page + 1 })
  }
  handleNationalityChange = (event) => {
    this.setState({ selectedNationality: event.target.value, page: 1 });
  }

  render() {
    // console.log('render');
    const { users, isLoading, page, isError, selectedNationality } = this.state;
    if (isLoading) {
      return <p className={styles.loader}>Loading....</p>
    }
    if (isError) {
      return <p>Error...</p>
    }
    return (
      <section className={styles.userList}>
        <h2>Users List</h2>
        <hr />

        <div className={styles.nationality}>
          <label htmlFor="nationality">Select Nationality: </label>
          <select
            id="nationality"
            onChange={this.handleNationalityChange}
            value={selectedNationality}
          >
            {this.nationalities.map(nat => (
              <option key={nat.code} value={nat.code}>
                {nat.label}
              </option>
            ))}
          </select>
        </div>

        <button disabled={page === 1} onClick={this.prevPage}>{"<"}</button>
        <span className={styles.currPage}> {page} </span>
        <button onClick={this.nextPage}>{">"}</button>
        <ul>
          {users.map(u => <li key={u.login.uuid}>{u.name.first} {u.name.last}</li>)}
        </ul>
      </section>
    );
  }
}

export default UsersLoader;
