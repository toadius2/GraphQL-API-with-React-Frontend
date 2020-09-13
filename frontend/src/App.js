import React, { useState, useEffect } from 'react';
import './App.css';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import gql from "graphql-tag";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const MUTATION_ADD_PRODUCT = gql`
  mutation add($name: String!, $description: String!, $price: Int!) {
    addProduct(name: $name, description: $description, price: $price) {
        name
    }
  }
`;

const MUTATION_UPDATE_PRODUCT = gql`
  mutation update($id: Int!, $name: String!, $description: String!, $price: Int!) {
        updateProduct(id: $id, name: $name, description: $description, price: $price) {
      name
    }
  }
`;

const MUTATION_DELETE_PRODUCT = gql`
  mutation delete($id: Int!) {
        deleteProduct(id: $id) {
      name
    }
  }
`;

const QUERY_GET_PRODUCT = gql`
  query {
    getProducts {
        id,
        name,
        description,
        price
    }
  }
`;

const QUERY_GET_PRODUCT_DETAIL = gql`
  query($id: Int) {
    getProducts(id: $id) {
        id,
        name,
        description,
        price
    }
  }
`;

function App() {
  // login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Product Add Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Product Table
  const [products, setProducts] = useState([]);

  // Image Upload Modal 
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Edit Product Modal 
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');


  const [loadProducts] = useLazyQuery(QUERY_GET_PRODUCT, {
    onCompleted: result => {
      setProducts(result.getProducts);
    },
    onError: error => {
      alert('Facing issue in fetching products');
    }
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const [onAddProduct] = useMutation(MUTATION_ADD_PRODUCT, {
    update: (proxy, result) => {
      const productName = result.data.addProduct.name;
      alert(`${productName} has been added to the database`);
      setShowAddForm(false);
    },
    variables: {
      name: productName,
      description: productDescription,
      price: Number(productPrice)
    }
  });

  const [onDeleteProduct] = useMutation(MUTATION_DELETE_PRODUCT, {
    update: (proxy, result) => {
      const productName = result.data.deleteProduct.name;
      alert(`${productName} has been deleted from the database`);
      window.location.reload();
    }
  });

  const [onUpdateProduct] = useMutation(MUTATION_UPDATE_PRODUCT, {
    update: (proxy, result) => {
      const productName = result.data.updateProduct.name;
      alert(`${productName} has been updated in the database`);
      window.location.reload();
    }
  });


  const handleLogin = () => {
    axios.get('http://localhost:8080/login', {
      auth: {
        username: username,
        password: password
      },
    }).then(response => {
      console.log(response);
      localStorage.removeItem('token');
      localStorage.setItem('token', response.data.token);
      window.location.reload();
    }).catch(ex => {
      alert(ex);
    });
  }

  const handleAddProduct = (e) => {
    e.preventDefault();
    onAddProduct();
  }

  const handleUpload = async () => {
    let formData = new FormData();
    let imagefile = document.getElementById('upload-file');
    console.log(imagefile);
    formData.append("file", imagefile.files[0]);
    if (imagefile !== undefined) {
      axios.post('http://localhost:8080/upload-image', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(result => {
        // alert(result);
      }).catch(error => {
        // alert(error);
      });
    }
  }

  const handleEditClick = (id) => {
    setEditingId(id);
    setShowEditModal(true);
  }

  //const [products, setProducts] = useState([]);
  // const [addProduct, { loading }] = useMutation(MUTATION_ADD_PRODUCT, {
  //   update: (proxy, mutationResult) => {
  //     console.log(mutationResult.data.addProduct.name);
  //   },
  //   variables: {
  //     name: 'Hritik',
  //     description: 'Bhalus love',
  //     price: 1000
  //   }
  // });

  // if (loading) return <p>Loading!</p>;

  // return (
  //   <h1 onClick={() => {
  //     addProduct().then(response => {
  //       console.log("response is", response)
  //     }).catch(ex => {
  //       console.log("error is", ex);
  //     })
  //   }}>done</h1>
  // );

  return (
    <>
      {!localStorage.getItem('token') && <table>
        <tr>
          <td>Email</td>
          <td><input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input></td>
        </tr>
        <tr>
          <td colSpan="2">
            <button onClick={handleLogin}>Login</button>
          </td>
        </tr>
      </table>}
      {localStorage.getItem('token') &&
        <>
          <button onClick={() => setShowAddForm(!showAddForm)}>Add Product</button>
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}>Logout</button>
          {showAddForm &&
            <form>
              <table>
                <tr>
                  <td>Product Name</td>
                  <td><input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} /></td>
                </tr>
                <tr>
                  <td>Product Description</td>
                  <td><input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} /></td>
                </tr>
                <tr>
                  <td>Product Price</td>
                  <td><input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} /></td>
                </tr>
                <tr>
                  <td colSpan="2"><button onClick={(e) => {
                    handleAddProduct(e);
                    loadProducts();
                  }}>Save</button></td>
                </tr>
              </table>
            </form>}
          <table>
            <tr>
              <td>Product ID</td>
              <td>Product Image</td>
              <td>Product Name</td>
              <td>Product Description</td>
              <td>Product Price</td>
            </tr>
            {products && products.map(product => {
              return (
                <tr>
                  <td>{product.id}</td>
                  <td><img src={product.image} height="40" width="40" alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>
                    <button onClick={() => handleEditClick(product.id)}><img width="20" height="20" src="icons/edit.png" alt="" /></button>
                    <Modal show={showEditModal} onHide={() => {
                      setShowEditModal(false);
                    }}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <table>
                          <tr>
                            <td>Product Name</td>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                          </tr>
                          <tr>
                            <td>Product Description</td>
                            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                          </tr>
                          <tr>
                            <td>Product Price</td>
                            <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                          </tr>
                        </table>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={() => {
                          onUpdateProduct({ variables: { id: Number(editingId), name: editName, description: editDescription, price: Number(editPrice) } })
                        }}>Save</Button>
                        <Button variant="secondary" onClick={() => {
                          setShowEditModal(false);
                        }}>Close</Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                  <td><button onClick={() => {
                    onDeleteProduct({ variables: { id: product.id } });
                    loadProducts();
                  }}><img width="20" height="20" src="icons/delete.png" alt="" /></button></td>
                  <td>
                    <button onClick={() => {
                      setShowImageUpload(true)
                    }}><img width="20" height="20" src="icons/image.png" alt="" /></button>
                    <Modal show={showImageUpload} onHide={() => {
                      setShowImageUpload(false);
                    }}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <input id="upload-file" type="file" />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={handleUpload}>Upload</Button>
                        <Button variant="secondary" onClick={() => {
                          setShowImageUpload(false);
                        }}>Close</Button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                </tr>
              )
            })}
          </table>
        </>
      }
    </>
  )

}

export default App;
