import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Modal from 'react-modal';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      users: [],
      id: '',
      name: '',
      password: '',
      email: '',
      role: ''
    }
  };

  componentDidMount() {
      axios.get('/api/users')
        .then(res => {
          const users = res.data.users;
          this.setState({users: users});
        })
        .catch(error => console.log(error));
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    console.log(name, value);

    this.setState({
      [name]: value
    });
  };

  componentWillMount() {
    Modal.setAppElement('body');
  };

  openModal = (user) => {
    this.setState({
      modalIsOpen: true,
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      role: user.roles.name
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  };

  handleEditSubmit = (event) => {
    event.preventDefault();

    const userUpdate = {
      id: this.state.id,
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      role: this.state.role
    };

    axios.post('/api/users/edit', userUpdate)
      .then(res => {
        let key = this.state.id;
        this.setState(prevState => ({
          users: prevState.users.map(
            elem => elem.id === key? {
              name: this.state.name,
              password: this.state.password,
              email: this.state.email,
              roles: {
                name: this.state.role
              }
            }: elem
          )
        }));
      })
      .catch(error => console.log(error));
  };
  
  handleInsertSubmit = (event) => {
    event.preventDefault();
  
    const newUser = {
      id: '',
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      role: this.state.role
    };

    axios.post('/api/users/insert', newUser)
      .then(res => {
        let users = this.state.users;
        users = [newUser,...users];
        this.setState({users: users});
      })
      .catch(error => console.log(error));
  };

  handleDelete = (user) => {
    const newsId = {
      id: user.id
    };
    
    axios.post('/api/users/delete', newsId)
      .then(res => {
        this.setState(prevState => ({
          users: prevState.users.filter(elem => elem.id !== user.id)
        }));
      })
      .catch(error => console.log(error));
  }

  render() {
    return(
      <div>
        <h2>Add an user</h2>
        <form onSubmit={this.handleInsertSubmit}>
          <table>
            <tbody>
              <tr>
                <th><label>User's name</label></th>
                <td>
                  <input
                    name="name"
                    type="text"
                    onChange={this.handleInputChange} />
                </td>
              </tr>

              <tr>
                <th><label>Password</label></th>
                <td>
                  <textarea
                    name="password"
                    onChange={this.handleInputChange} />
                </td>
              </tr>

              <tr>
                <th><label>Email</label></th>
                <td>
                  <textarea
                    name="email"
                    onChange={this.handleInputChange} />
                </td>
              </tr>

              <tr>
                <th><label>Role</label></th>
                <td>
                  <select name='role' onChange={this.handleInputChange}>
                    <option value="none">(none)</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit">Submit</button>
        </form>

        <ul>
          {this.state.users.map(user => (
            <li key={user.id}>
              <h2>{user.name} ({user.roles.name})</h2>
              <div>{user.email}</div>
              <button onClick={() => this.openModal(user)}>Edit</button>
              <button onClick={() => this.handleDelete(user)}>Delete</button>
            </li>
          ))}
        </ul>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}>
          <button onClick={this.closeModal}>Close</button>
          
          <form onSubmit={this.handleEditSubmit}>
            <table>
              <tbody>
                <tr>
                  <th><label>Name</label></th>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={this.state.name} 
                      onChange={this.handleInputChange} />
                  </td>
                </tr>

                <tr>
                  <th><label>Password</label></th>
                  <td>
                    <textarea
                      name="password"
                      value={this.state.password}
                      onChange={this.handleInputChange} />
                  </td>
                </tr>

                <tr>
                  <th><label>Email</label></th>
                  <td>
                    <textarea
                      name="email"
                      value={this.state.email} 
                      onChange={this.handleInputChange} />
                  </td>
                </tr>

                <tr>
                  <th><label>Role</label></th>
                  <td>
                    <select name="role" onChange={this.handleInputChange} value={this.state.role}>
                      <option value="none">(none)</option>
                      <option value="admin">Admin</option>
                      <option value="guest">Guest</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit">Edit</button>
          </form>
        </Modal>
      </div>
    )
  };
};

export default App;