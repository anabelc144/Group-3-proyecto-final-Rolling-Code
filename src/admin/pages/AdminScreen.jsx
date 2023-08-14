import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Table from 'react-bootstrap/Table';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import pruebaApi from '../../api/pruebaapi';
import Header from '../../home/components/Header';
import '../../auth/css/adminscreen.css';



export const AdminScreen = () => {
    const [cargarUsuarios, setCargarUsuarios] = useState([]);
    const [cargarProducto, setCargarProducto] = useState([]);
    //se encarga de cerrar y abrir el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    //hook para almacenar los datos del formulario agregarProducto
    // const [formDateEditar, setFormDateEditar] = useState({
    //     _id: '',
    //     nombre: '',
    //     estado: '',    
    //     precio: '',
    //     detalle: '',    
    //     categoria: '' 
    // });
    //hook para almacenar los datos del formulario editarProducto
    const [formDate, setFormDate] = useState({
        nombre: '',
        estado: '',
        precio: '',
        detalle: '',
        categoria: ''
    });



    const handleChangeForm = (e) => {
        setFormDate({
            ...formDate,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmitForm = (e) => {
        e.preventDefault();
        var { nombre, estado, precio, detalle, categoria } = formDate;
        estado = !estado ? "No disponible" : "Disponible";


        if (!nombre.trim() || !precio || !detalle.trim() || !categoria) {
            return;
        }

        if (isNaN(parseFloat(precio))) {
            return;
        }

        setFormDate({
            nombre: '',
            estado: '',
            precio: '',
            detalle: '',
            categoria: '',
        });
        guardarProductoDb(nombre, estado, precio, detalle, categoria);

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    const guardarProductoDb = async (nombre, estado, precio, detalle, categoria) => {
        try {
            const resp = await pruebaApi.post('/admin/nuevoMenu', {
                nombre,
                estado,
                precio,
                detalle,
                categoria
            });
            console.log(resp);
        } catch (error) {
            console.log(error)
        }
    }

    const cargarUserDB = async () => {
        try {
            const resp = await pruebaApi.get('/admin/listarUsuarios');
            setCargarUsuarios(resp.data.usuarios);
        } catch (error) {
            console.log(error);
        }
    };
    const cargarProductoDB = async () => {
        try {
            const resp = await pruebaApi.get('/admin/listarMenu');
            setCargarProducto(resp.data.menus);
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        cargarUserDB();
        cargarProductoDB();
    }, []);
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };


    return (
        <>
            <Header></Header>
            <div className="">
                <h1 className="text-center p-3">Admin Page</h1>
                <h3>Usuarios</h3>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Nombre y apellido</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    {cargarUsuarios.map((usuario) => {
                        return (
                            <tbody key={usuario._id}>
                                <tr>
                                    <td>{usuario._id}</td>
                                    <td>{usuario.name}</td>
                                    <td>{usuario.email}</td>
                                </tr>
                            </tbody>
                        )
                    }
                    )
                    }
                </Table>
                <h3>Menus</h3>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Precio</th>
                            <th>Detalle</th>
                            <th>Categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    {cargarProducto.map((producto) => {
                        let pesoModif = producto.precio % 1 === 0 ? `$ ${producto.precio}.00` : `$ ${producto.precio.toFixed(2)}`;

                        return (
                            <tbody key={producto._id}>
                                <tr>
                                    <td>{producto._id}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.estado}</td>
                                    <td>{pesoModif}</td>
                                    <td>{producto.detalle}</td>
                                    <td>{producto.categoria}</td>
                                    <td>
                                        <button
                                        >
                                            {/* onClick={() => editarProductoClick()} */}
                                            <i className="fa-solid fa-pen-to-square"
                                                style={{ color: '#000000' }}></i>
                                        </button>
                                        <button
                                        >
                                            <i className="fa-solid fa-trash"
                                                style={{ color: '#000000' }}></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                    )
                    }
                </Table>
            </div>
            {/* Botón con icono "+" */}
            <div className="d-flex justify-content-end me-5">
                <button
                    className="add-product-button border rounded-circle p-3 bg-dark "
                    onClick={() => setIsModalOpen(true)}
                >
                    <FaPlus className="add-product-icon text-white" />
                </button>
            </div>


            {/* Modal para agregar producto */}
            {/* style={customStyles} */}
            <Modal isOpen={isModalOpen} style={customStyles} ariaHideApp={false} onRequestClose={() => setIsModalOpen(false)}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Agregar producto</h2>
                        <button type="button" className="btn-close m-3" onClick={() => setIsModalOpen(false)}></button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={handleSubmitForm}>
                            <Form.Group className="mb-3" controlId="formBasicCategoria">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formDate.nombre}
                                    onChange={handleChangeForm}
                                    placeholder="Ingrese el nombre del producto"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategoria">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio"
                                    value={formDate.precio}
                                    onChange={handleChangeForm}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategoria">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Select
                                    name="categoria"
                                    value={formDate.categoria}
                                    onChange={handleChangeForm}
                                    style={{ width: '100%' }}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="parrilla">Parrilla</option>
                                    <option value="empanadas">Empanadas</option>
                                    <option value="milanesas">Milanesas</option>
                                    <option value="pastas">Pastas</option>
                                    <option value="asado">Asado</option>
                                    <option value="pizzas">Pizzas</option>
                                    <option value="empanadas">Empanadas</option>
                                    <option value="comida criolla">Comida Criolla</option>
                                    <option value="mariscos">Mariscos</option>
                                    <option value="comida vegetariana">Comida Vegetariana</option>
                                    <option value="comida vegana">Comida Vegana</option>
                                    <option value="comida regional">Comida Regional</option>
                                    <option value="postres argentinos">Postres Argentinos</option>
                                    <option value="vinos argentinos">Vinos Argentinos</option>

                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategoria">

                                <Form.Check
                                    type="checkbox"
                                    name="estado"
                                    label="Disponible"
                                    checked={formDate.activo}
                                    onChange={handleChangeForm}

                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCategoria">
                                <Form.Label>Detalle</Form.Label>
                                <textarea
                                    name="detalle"
                                    className="form-control"
                                    rows="3"
                                    value={formDate.detalle}
                                    onChange={handleChangeForm}
                                    required
                                ></textarea>
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="success" className="custom-button" >
                                    Dar de alta
                                </Button>

                            </div>
                        </Form>
                    </div>
                </div >
            </Modal >
        </>
    );
};

