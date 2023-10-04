import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from "../constants";
import ContactItem from './ContactItem';
import SearchBar from './SearchBar';
import { toast } from 'react-toastify';

function ContactList({ accessToken }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        setLoading(true);

        const url = `${API_BASE_URL}/api/biz/contacts?expand=Info,Info.DefaultPhone,Info.DefaultEmail&filter=contains(Info.Name,'${searchQuery}')&hateoas=false&top=${10}&skip=${(currentPage - 1) * 10}`;

        axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          setContacts(response.data);
          setTotalPages(Math.ceil(response.headers['x-total-count'] / 10));
          setLoading(false);
        })
        .catch(error => {
          toast.error("Error fetching contacts: " + error, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setLoading(false);
        });

        if (inputRef.current) {
            inputRef.current.focus();
        }

    }, [accessToken, searchQuery, currentPage]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const updateContact = (updatedContact) => {
        setContacts(prevContacts => 
            prevContacts.map(contact =>
                contact.ID === updatedContact.ID ? updatedContact : contact
            )
        );
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
    
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Contact List</h1>
            <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} inputRef={inputRef}/>
            {contacts.map(contact => (
                <ContactItem key={contact.ID} accessToken={accessToken} contact={contact} updateContact={updateContact} />
            ))}
            <Link to={`/add/`}><button>Add Contact</button></Link>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>

        </div>
    );
}

export default ContactList;
