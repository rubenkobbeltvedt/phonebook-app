import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../constants";


function ContactItem({ accessToken, contact, setContacts, updateContact }) {
  const [showDetails, setShowDetails] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);

  const showError = () => toast.error('An error occurred!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const showSuccess = () => toast.success('Success', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
    setEdit(false)
  };

  const handleInputChange = (name, value) => {
    setEditedContact(prevContact => ({
      ...prevContact,
      Info: {
        ...prevContact.Info,
        [name]: value
      }
    }));
  };

  function onRemove(id) {
    const url = `${API_BASE_URL}/api/biz/contacts/${id}`;
    axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setContacts(prevContacts => prevContacts.filter(contact => contact.ID !== id));
      showSuccess()
    })
    .catch(error => {
      showError()
    });
  }

  const handleSaveEdit = () => {
    const url = `${API_BASE_URL}/api/biz/contacts/${contact.ID}`;
    if (edit) {
      axios.put(url, editedContact, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log("Contact edited successfully:", response.data);
        setEdit(false);
        updateContact(editedContact);
        showSuccess()
      })
      .catch(error => {
        showError();
      });
    } else {
      setEdit(true);
    }

  };

  return (
    <div>
      {contact.Info.Name && <h3>{contact.Info.Name}</h3>}
        {showDetails && (
          <div>
            <p>Email: {contact.Info.DefaultEmail.EmailAddress}</p>
            <p>Phone: {contact.Info.DefaultPhone.Number}</p>
            {edit && (
              <div>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="Name"
                    value={editedContact.Info.Name}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="text"
                    name="EmailAddress"
                    value={editedContact.Info.DefaultEmail.EmailAddress}
                    onChange={(e) => handleInputChange('DefaultEmail', { EmailAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="Number"
                    value={editedContact.Info.DefaultPhone.Number}
                    onChange={(e) => handleInputChange('DefaultPhone', { Number: e.target.value })}
                  />
                </div>
              </div>
            )}
            <Link to="#" onClick={handleSaveEdit}>
              <button>{edit ? 'Save' : 'Edit'}</button>
            </Link>
            <button onClick={() => onRemove(contact.ID)}>Remove</button>
          </div>
        )}
        <Link to="#" onClick={handleToggleDetails}>
          <button>{showDetails ? 'Hide' : 'View'}</button>
        </Link>
    </div>
  );
}

export default ContactItem;
