import { useState, useEffect } from "react";
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import './test.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



export default function BasicDemo() {

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [posts, setPosts] = useState([]);
    console.log(first, rows)
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
        console.log(posts);
    }, [first, rows]);


    return (
        <PrimeReactProvider value={{ unstyled: false }}>

            <div className="card">
                <DataTable value={posts} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
                    <Column field="id" header="id" sortable ></Column>
                    <Column field="title" header="title" sortable ></Column>
                    <Column field="body" header="body" sortable ></Column>
                    
                </DataTable>
            </div>
            <div className="card">
                <Paginator first={first} rows={rows} totalRecords={100}
                    rowsPerPageOptions={[5, 10, 20]} onPageChange={onPageChange} />
            </div>
        </PrimeReactProvider >
    );
}
