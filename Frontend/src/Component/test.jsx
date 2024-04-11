import React, { useState, useEffect } from "react";
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import './test.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";


export default function BasicDemo() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [posts, setPosts] = useState([]);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                params: {
                    _start: first,
                    _limit: rows
                }
            });
            setPosts(result.data);
        }

        fetchData();
    }, [first, rows]);


    return (
        <PrimeReactProvider value={{ unstyled: false }}>

            <table className="table table-striped p-3 shadow-sm">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Body</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.title}</td>
                                <td>{user.body}</td>
                                <td>
                                    <div>
                                        Action
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className="card">
                <Paginator first={first} rows={rows} totalRecords={100}
                    rowsPerPageOptions={[5, 10, 20]} onPageChange={onPageChange} />
            </div>
        </PrimeReactProvider >
    );
}
